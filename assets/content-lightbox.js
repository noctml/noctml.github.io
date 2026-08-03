(() => {
  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    if (document.getElementById("lightbox") || document.getElementById("contentLightbox")) return;

    const eligibleImages = Array.from(
      document.querySelectorAll("main img, .project-case-study img")
    ).filter((image) => {
      if (image.closest("[data-no-lightbox], .bookmark, .study-brand, .project-brand, .project-home-profile")) return false;
      return !image.classList.contains("icon") && !image.classList.contains("bookmark-image");
    });
    if (!eligibleImages.length) return;

    const lightbox = document.createElement("div");
    lightbox.id = "contentLightbox";
    lightbox.className = "content-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = [
      '<button class="content-lightbox__close" type="button" aria-label="이미지 닫기">&times;</button>',
      '<img class="content-lightbox__image" alt="" />'
    ].join("");
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".content-lightbox__image");
    const closeButton = lightbox.querySelector(".content-lightbox__close");
    const initialDevicePixelRatio = window.devicePixelRatio || 1;
    let savedScrollY = 0;
    let gestureStartScale = 1;
    const zoom = {
      scale: 1,
      x: 0,
      y: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0
    };

    const applyZoom = () => {
      lightbox.style.setProperty("--content-lightbox-zoom", String(zoom.scale));
      lightbox.style.setProperty("--content-lightbox-pan-x", `${zoom.x}px`);
      lightbox.style.setProperty("--content-lightbox-pan-y", `${zoom.y}px`);
      lightbox.classList.toggle("is-zoomed", zoom.scale > 1);
    };

    const resetZoom = () => {
      zoom.scale = 1;
      zoom.x = 0;
      zoom.y = 0;
      zoom.dragging = false;
      applyZoom();
    };

    const setScale = (scale) => {
      zoom.scale = Math.min(5, Math.max(1, scale));
      if (zoom.scale < 1.015) zoom.scale = 1;
      if (zoom.scale === 1) {
        zoom.x = 0;
        zoom.y = 0;
        zoom.dragging = false;
      }
      applyZoom();
    };

    const applyPageScale = () => {
      const currentDevicePixelRatio = window.devicePixelRatio || initialDevicePixelRatio;
      const viewportScale = window.visualViewport?.scale || 1;
      const totalScale = Math.max(0.001, (currentDevicePixelRatio / initialDevicePixelRatio) * viewportScale);
      lightbox.style.setProperty("--content-lightbox-page-scale", String(1 / totalScale));
    };

    const lockScroll = () => {
      if (document.body.classList.contains("content-lightbox-scroll-locked")) return;
      savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("content-lightbox-scroll-locked");
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
    };

    const unlockScroll = () => {
      if (!document.body.classList.contains("content-lightbox-scroll-locked")) return;
      document.body.classList.remove("content-lightbox-scroll-locked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ left: 0, top: savedScrollY, behavior: "auto" });
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });
    };

    const open = (image) => {
      applyPageScale();
      resetZoom();
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "확대 이미지";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      lockScroll();
    };

    const close = () => {
      if (!lightbox.classList.contains("is-open")) return;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      resetZoom();
      lightbox.style.setProperty("--content-lightbox-page-scale", "1");
      lightboxImage.removeAttribute("src");
      unlockScroll();
    };

    eligibleImages.forEach((image) => image.classList.add("content-lightbox-trigger"));

    document.addEventListener("click", (event) => {
      const image = event.target.closest("img.content-lightbox-trigger");
      if (!image) return;
      event.preventDefault();
      open(image);
    });

    closeButton.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    lightboxImage.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    lightbox.addEventListener("wheel", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      event.preventDefault();
      if (event.ctrlKey) {
        setScale(zoom.scale * Math.exp(-event.deltaY * 0.01));
      } else if (zoom.scale > 1) {
        zoom.x -= event.deltaX;
        zoom.y -= event.deltaY;
        applyZoom();
      }
    }, { passive: false });

    lightbox.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
    lightbox.addEventListener("gesturestart", (event) => {
      event.preventDefault();
      gestureStartScale = zoom.scale;
    }, { passive: false });
    lightbox.addEventListener("gesturechange", (event) => {
      event.preventDefault();
      setScale(gestureStartScale * event.scale);
    }, { passive: false });

    lightboxImage.addEventListener("pointerdown", (event) => {
      if (zoom.scale <= 1) return;
      zoom.dragging = true;
      zoom.startX = event.clientX;
      zoom.startY = event.clientY;
      zoom.originX = zoom.x;
      zoom.originY = zoom.y;
      lightboxImage.setPointerCapture?.(event.pointerId);
    });
    lightboxImage.addEventListener("pointermove", (event) => {
      if (!zoom.dragging) return;
      zoom.x = zoom.originX + event.clientX - zoom.startX;
      zoom.y = zoom.originY + event.clientY - zoom.startY;
      applyZoom();
    });
    const endDrag = (event) => {
      if (!zoom.dragging) return;
      zoom.dragging = false;
      lightboxImage.releasePointerCapture?.(event.pointerId);
    };
    lightboxImage.addEventListener("pointerup", endDrag);
    lightboxImage.addEventListener("pointercancel", endDrag);

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  });
})();
