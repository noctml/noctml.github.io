(() => {
  const viewers = Array.from(
    document.querySelectorAll(".pdf-viewer[data-pages][data-slide-base]")
  );
  if (!viewers.length) return;

  const buildCarousel = (viewer) => {
    const pageCount = Number.parseInt(viewer.dataset.pages || "", 10);
    const slideBase = viewer.dataset.slideBase;
    if (!Number.isFinite(pageCount) || pageCount < 1 || !slideBase) return;

    const iframeTitle =
      viewer.querySelector("iframe")?.title || "Study presentation";
    const carousel = document.createElement("div");
    const track = document.createElement("div");
    const count = document.createElement("div");
    const pages = [];
    let activeIndex = 0;
    let frameRequest = 0;

    carousel.className = "mobile-pdf-carousel";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-label", `${iframeTitle} slides`);

    track.className = "mobile-pdf-track";
    track.tabIndex = 0;
    track.setAttribute("aria-label", `${pageCount} slides`);

    count.className = "mobile-pdf-count";
    count.setAttribute("aria-live", "polite");

    const loadNear = (index) => {
      const start = Math.max(0, index - 1);
      const end = Math.min(pageCount - 1, index + 2);

      for (let slideIndex = start; slideIndex <= end; slideIndex += 1) {
        const image = pages[slideIndex]?.querySelector("img[data-src]");
        if (!image) continue;
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }
    };

    const setActive = (index) => {
      const nextIndex = Math.max(0, Math.min(pageCount - 1, index));
      if (nextIndex !== activeIndex) activeIndex = nextIndex;
      count.textContent = `${activeIndex + 1} / ${pageCount}`;
      loadNear(activeIndex);
    };

    for (let index = 0; index < pageCount; index += 1) {
      const page = document.createElement("figure");
      const image = document.createElement("img");
      const pageNumber = String(index + 1).padStart(2, "0");

      page.className = "mobile-pdf-page";
      image.alt = `${iframeTitle}, slide ${index + 1} of ${pageCount}`;
      image.decoding = "async";
      image.draggable = false;
      image.dataset.src = `${slideBase}/page-${pageNumber}.webp`;

      if (index === 0) {
        image.src = image.dataset.src;
        image.fetchPriority = "high";
        image.removeAttribute("data-src");
      } else {
        image.loading = "lazy";
      }

      page.append(image);
      track.append(page);
      pages.push(page);
    }

    const updateFromScroll = () => {
      frameRequest = 0;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      pages.forEach((page, index) => {
        const distance = Math.abs(page.offsetLeft - track.scrollLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActive(nearestIndex);
    };

    track.addEventListener(
      "scroll",
      () => {
        if (frameRequest) return;
        frameRequest = window.requestAnimationFrame(updateFromScroll);
      },
      { passive: true }
    );

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        track.scrollLeft = pages[activeIndex]?.offsetLeft || 0;
      }).observe(track);
    }

    carousel.append(track, count);
    viewer.append(carousel);
    setActive(0);
  };

  viewers.forEach(buildCarousel);
})();
