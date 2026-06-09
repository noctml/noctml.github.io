(() => {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  try { window.localStorage.removeItem("theme"); } catch {
    // Storage can be unavailable for local file previews.
  }
})();

(() => {
  const root = document.documentElement;
  const langBtn = document.getElementById("langBtn");
  const panels = Array.from(document.querySelectorAll("[data-lang-panel]"));
  const translatable = Array.from(document.querySelectorAll("[data-ko][data-en]"));
  const htmlTranslatable = Array.from(document.querySelectorAll("[data-ko-html][data-en-html]"));
  const moreBtn = document.getElementById("deepDiveMoreBtn");

  const storageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable for local file previews.
    }
  };

  let currentLang = storageGet("paper-lang") === "en" ? "en" : "ko";

  const getActivePanel = () => panels.find((panel) => panel.dataset.langPanel === currentLang);

  const syncPanelImageWidths = () => {
    const widthBySrc = new Map();
    panels.forEach((panel) => {
      panel.querySelectorAll("img").forEach((image) => {
        const src = image.getAttribute("src");
        const width = Number.parseFloat(image.style.width || "");
        if (!src || !Number.isFinite(width) || width <= 0 || width > 900) return;
        const current = widthBySrc.get(src);
        widthBySrc.set(src, current ? Math.min(current, width) : width);
      });
    });

    panels.forEach((panel) => {
      panel.querySelectorAll("img").forEach((image) => {
        const src = image.getAttribute("src");
        const width = src ? widthBySrc.get(src) : null;
        if (!width || image.style.width) return;
        image.style.width = `${width}px`;
        image.style.maxWidth = `min(100%, ${Math.ceil(width)}px)`;
      });
    });
  };


  const renderDynamicMath = (rootNode) => {
    if (typeof window.renderMathInElement !== "function" || !rootNode) return;
    window.renderMathInElement(rootNode, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  };

  const updateDeepDiveButton = () => {
    if (typeof window.syncDeepDiveReveal === "function") {
      window.syncDeepDiveReveal();
      return;
    }
    const activePanel = getActivePanel();
    const more = document.getElementById("deepDiveMore");
    if (!more || !activePanel) return;
    const body = more.closest(".deep-dive-body");
    const isCollapsed = activePanel.classList.contains("is-collapsed");
    body?.classList.toggle("has-collapsed-active", isCollapsed);
    more.classList.toggle("is-visible", isCollapsed);
    more.hidden = !isCollapsed;
    more.setAttribute("aria-hidden", String(!isCollapsed));
  };

  const applyLanguage = (lang, persist = true) => {
    currentLang = lang === "en" ? "en" : "ko";
    root.lang = currentLang;
    if (persist) storageSet("paper-lang", currentLang);
    if (langBtn) langBtn.dataset.lang = currentLang;

    translatable.forEach((node) => {
      node.textContent = node.dataset[currentLang] || "";
    });

    htmlTranslatable.forEach((node) => {
      node.innerHTML = currentLang === "en" ? node.dataset.enHtml : node.dataset.koHtml;
      renderDynamicMath(node);
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.langPanel !== currentLang;
    });

    syncPanelImageWidths();

    if (moreBtn) {
      moreBtn.textContent = currentLang === "en" ? moreBtn.dataset.en : moreBtn.dataset.ko;
    }

    rebuildBookmarks();
    updateDeepDiveButton();
  };

  langBtn?.addEventListener("click", () => {
    applyLanguage(currentLang === "ko" ? "en" : "ko");
  });

  window.__applyPaperLanguage = applyLanguage;
  window.__getPaperLanguage = () => currentLang;

  requestAnimationFrame(() => applyLanguage(currentLang, false));
})();

(() => {
  const more = document.getElementById("deepDiveMore");
  const moreBtn = document.getElementById("deepDiveMoreBtn");
  const contents = Array.from(document.querySelectorAll(".deep-dive-content"));
  const body = more?.closest(".deep-dive-body");

  if (!more || !moreBtn || !body || !contents.length) return;

  const activeContent = () => contents.find((content) => !content.hidden) || contents[0];

  const syncRevealState = () => {
    const content = activeContent();
    const collapsed = Boolean(content?.classList.contains("is-collapsed"));
    body.classList.toggle("has-collapsed-active", collapsed);
    more.classList.toggle("is-visible", collapsed);
    more.hidden = !collapsed;
    more.setAttribute("aria-hidden", String(!collapsed));
    moreBtn.setAttribute("aria-expanded", String(!collapsed));
    if (content?.id) moreBtn.setAttribute("aria-controls", content.id);
  };

  const reveal = () => {
    contents.forEach((content) => content.classList.remove("is-collapsed"));
    syncRevealState();
    rebuildBookmarks();
  };

  moreBtn?.addEventListener("click", () => {
    reveal();
  });

  window.revealDeepDive = reveal;
  window.syncDeepDiveReveal = syncRevealState;
  window.addEventListener("pageshow", syncRevealState);
  syncRevealState();
})();

(() => {
  const detailsList = Array.from(document.querySelectorAll("details.supplement-toggle"));
  if (!detailsList.length) return;

  const backdrop = document.createElement("div");
  backdrop.className = "supplement-focus-backdrop";
  backdrop.hidden = true;
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "supplement-scroll-indicator";
  scrollIndicator.hidden = true;
  scrollIndicator.setAttribute("aria-hidden", "true");

  const scrollThumb = document.createElement("span");
  scrollThumb.className = "supplement-scroll-indicator-thumb";
  scrollIndicator.appendChild(scrollThumb);
  document.body.appendChild(scrollIndicator);

  const scrollSpacer = document.createElement("div");
  scrollSpacer.className = "supplement-scroll-spacer";
  scrollSpacer.hidden = true;
  scrollSpacer.setAttribute("aria-hidden", "true");
  document.body.appendChild(scrollSpacer);

  let indicatorFrameId = 0;

  const isVisible = (details) => !details.closest("[hidden]");

  const focusedDetails = () => detailsList.find((details) => details.open && isVisible(details));

  const getPanelTopOffset = () => {
    const topbar = document.querySelector(".topbar");
    const topbarHeight = topbar?.offsetHeight || 0;
    const panelGap = 4;
    return Math.max(12, Math.ceil(topbarHeight + panelGap));
  };

  const setWindowScrollTop = (top) => {
    const targetTop = Math.max(0, top);
    const rootStyle = document.documentElement.style;
    const previousScrollBehavior = rootStyle.scrollBehavior;
    const previousOverflowAnchor = rootStyle.overflowAnchor;
    const applyScroll = () => {
      const scroller = document.scrollingElement || document.documentElement;
      rootStyle.scrollBehavior = "auto";
      rootStyle.overflowAnchor = "none";
      document.documentElement.scrollTop = targetTop;
      document.body.scrollTop = targetTop;
      if (scroller) scroller.scrollTop = targetTop;
      window.scrollTo(0, targetTop);
    };

    applyScroll();
    window.setTimeout(applyScroll, 0);
    window.setTimeout(() => {
      applyScroll();
      rootStyle.scrollBehavior = previousScrollBehavior;
      rootStyle.overflowAnchor = previousOverflowAnchor;
    }, 120);
  };

  const reserveScrollRoom = (details) => {
    if (!details || !details.open || !isVisible(details)) {
      scrollSpacer.hidden = true;
      scrollSpacer.style.height = "0px";
      return;
    }

    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const reserveHeight = Math.max(0, window.innerHeight - panelTopOffset - bottomInset + 120);
    scrollSpacer.hidden = false;
    scrollSpacer.style.height = `${reserveHeight}px`;
  };

  const alignDetailsToViewport = (details) => {
    const shouldRelock = document.documentElement.classList.contains("supplement-scroll-lock");
    if (shouldRelock) setPageScrollLock(false);
    reserveScrollRoom(details);
    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const rect = details.getBoundingClientRect();
    const targetTop = Math.max(0, window.scrollY + rect.top - panelTopOffset);
    setWindowScrollTop(targetTop);
    const alignedRect = details.getBoundingClientRect();
    details.style.setProperty("--supplement-panel-top", `${Math.round(panelTopOffset)}px`);
    details.style.setProperty("--supplement-panel-left", `${Math.round(alignedRect.left)}px`);
    details.style.setProperty("--supplement-panel-width", `${Math.round(alignedRect.width)}px`);
    details.style.setProperty("--supplement-panel-bottom", `${bottomInset}px`);
    if (shouldRelock) setPageScrollLock(true);
  };

  const scheduleOpenAlignment = (details) => {
    const alignAndMeasure = () => {
      if (!details.open || !isVisible(details)) return;
      details.scrollTop = 0;
      alignDetailsToViewport(details);
      updatePanelBounds();
    };

    requestAnimationFrame(() => {
      alignAndMeasure();
      requestAnimationFrame(alignAndMeasure);
    });
    window.setTimeout(alignAndMeasure, 80);
    window.setTimeout(alignAndMeasure, 180);
    window.setTimeout(requestScrollIndicatorUpdate, 220);
    window.setTimeout(requestScrollIndicatorUpdate, 480);
    window.setTimeout(requestScrollIndicatorUpdate, 720);
    window.setTimeout(updateScrollIndicator, 520);
    window.setTimeout(updateScrollIndicator, 900);
  };

  const updatePanelBounds = () => {
    const details = focusedDetails();
    detailsList.forEach((item) => {
      if (item !== details) item.style.removeProperty("--supplement-panel-max-height");
    });
    if (!details) return;

    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const availableHeight = window.innerHeight - panelTopOffset - bottomInset;
    details.style.setProperty("--supplement-panel-max-height", `${Math.max(320, availableHeight)}px`);
    const rect = details.getBoundingClientRect();
    details.style.setProperty("--supplement-panel-top", `${Math.round(panelTopOffset)}px`);
    details.style.setProperty("--supplement-panel-left", `${Math.round(rect.left)}px`);
    details.style.setProperty("--supplement-panel-width", `${Math.round(rect.width)}px`);
    details.style.setProperty("--supplement-panel-bottom", `${bottomInset}px`);
  };

  const setPageScrollLock = (shouldLock) => {
    document.documentElement.classList.toggle("supplement-scroll-lock", shouldLock);
    if (shouldLock) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
    } else {
      document.body.style.paddingRight = "";
    }
  };

  const updateScrollIndicator = () => {
    const details = focusedDetails();
    if (!details) {
      scrollIndicator.hidden = true;
      scrollIndicator.classList.remove("is-visible");
      return;
    }

    const maxScroll = details.scrollHeight - details.clientHeight;
    if (maxScroll <= 4) {
      scrollIndicator.hidden = true;
      scrollIndicator.classList.remove("is-visible");
      return;
    }

    const rect = details.getBoundingClientRect();
    const summaryRect = details.querySelector("summary")?.getBoundingClientRect();
    const top = Math.max(14, rect.top + (summaryRect?.height || 48) + 14);
    const height = Math.max(56, Math.min(rect.bottom - top - 16, window.innerHeight - top - 16));
    const right = Math.max(12, window.innerWidth - rect.right + 12);
    const scrollRatio = details.scrollTop / maxScroll;
    const thumbHeight = Math.max(30, height * (details.clientHeight / details.scrollHeight));
    const thumbOffset = (height - thumbHeight) * scrollRatio;

    scrollIndicator.style.setProperty("--supplement-indicator-top", `${top}px`);
    scrollIndicator.style.setProperty("--supplement-indicator-right", `${right}px`);
    scrollIndicator.style.setProperty("--supplement-indicator-height", `${height}px`);
    scrollIndicator.style.setProperty("--supplement-thumb-height", `${thumbHeight}px`);
    scrollIndicator.style.setProperty("--supplement-thumb-offset", `${thumbOffset}px`);
    scrollIndicator.hidden = false;
    scrollIndicator.classList.add("is-visible");
  };

  const requestScrollIndicatorUpdate = () => {
    if (indicatorFrameId) return;
    indicatorFrameId = window.requestAnimationFrame(() => {
      indicatorFrameId = 0;
      updateScrollIndicator();
    });
  };

  const hideScrollIndicator = () => {
    if (indicatorFrameId) {
      window.cancelAnimationFrame(indicatorFrameId);
      indicatorFrameId = 0;
    }
    scrollIndicator.hidden = true;
    scrollIndicator.classList.remove("is-visible");
  };

  const scheduleClosedAlignment = (details) => {
    const alignClosedDetails = () => {
      if (!details || details.open || !isVisible(details)) return;
      const panelTopOffset = getPanelTopOffset();
      const previousScrollMargin = details.style.scrollMarginTop;
      details.style.scrollMarginTop = `${panelTopOffset}px`;
      details.scrollIntoView(true);
      let rect = details.getBoundingClientRect();
      const nativeDelta = rect.top - panelTopOffset;
      if (Math.abs(nativeDelta) > 1) {
        details.style.scrollMarginTop = `${Math.max(0, panelTopOffset - nativeDelta)}px`;
        details.scrollIntoView(true);
        rect = details.getBoundingClientRect();
      }
      const targetTop = Math.max(0, window.scrollY + rect.top - panelTopOffset);
      setWindowScrollTop(targetTop);
      details.style.scrollMarginTop = previousScrollMargin;
    };

    alignClosedDetails();
    window.setTimeout(alignClosedDetails, 0);
    window.setTimeout(alignClosedDetails, 80);
    window.setTimeout(alignClosedDetails, 180);
  };

  const updateFocus = ({ deferIndicator = false } = {}) => {
    const openDetails = detailsList.filter((details) => details.open && isVisible(details));
    const hasOpenDetail = openDetails.length > 0;
    document.body.classList.toggle("supplement-focus-active", hasOpenDetail);
    reserveScrollRoom(openDetails[0]);
    setPageScrollLock(hasOpenDetail);
    backdrop.hidden = !hasOpenDetail;
    detailsList.forEach((details) => {
      details.classList.toggle("is-focused-supplement", details.open && isVisible(details));
    });
    requestAnimationFrame(() => {
      updatePanelBounds();
      if (!hasOpenDetail) {
        hideScrollIndicator();
      } else if (deferIndicator) {
        hideScrollIndicator();
        window.setTimeout(requestScrollIndicatorUpdate, 160);
      } else {
        requestScrollIndicatorUpdate();
      }
    });
  };

  const closeOpenDetails = () => {
    const detailToRestore = detailsList.find((details) => details.open && isVisible(details));
    detailsList.forEach((details) => {
      details.open = false;
    });
    updateFocus();
    if (detailToRestore) scheduleClosedAlignment(detailToRestore);
  };

  const syncLabels = () => {
    const lang = document.documentElement.lang === "en" ? "en" : "ko";
    document.querySelectorAll(".supplement-close-btn").forEach((button) => {
      button.textContent = lang === "en" ? "Close section" : "접기";
      button.setAttribute("aria-label", lang === "en" ? "Close this supplement" : "이 보충 설명 접기");
    });
    document.querySelectorAll(".supplement-lazy-placeholder").forEach((placeholder) => {
      placeholder.textContent = lang === "en" ? "Preparing detailed notes..." : "세부 내용을 준비하는 중...";
    });
  };

  const markSupplementSubheadings = (scope = document) => {
    scope.querySelectorAll("details.supplement-toggle :is(p, blockquote, li, h4)").forEach((node) => {
      if (node.closest("summary, .summary-panel, .result-brief, .section-note, .supplement-close-row")) return;
      const strong = node.querySelector(":scope > strong");
      const text = node.textContent.trim().replace(/\s+/g, " ");
      const strongText = strong?.textContent.trim().replace(/\s+/g, " ");
      const isStandaloneHeading = Boolean(
        strong &&
        node.children.length === 1 &&
        text &&
        text === strongText &&
        text.length <= 90 &&
        !text.startsWith("→") &&
        !text.startsWith("+") &&
        !text.includes("✅") &&
        !text.includes("❌")
      );

      node.classList.toggle("toggle-subheading-line", isStandaloneHeading);
    });
  };

  const skipCloseRestore = new WeakSet();

  const createLazyBody = (details, closeRow) => {
    const template = details.querySelector(":scope > template.supplement-lazy-template");
    if (template) {
      let placeholder = details.querySelector(":scope > .supplement-lazy-placeholder");
      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.className = "supplement-lazy-placeholder";
        details.insertBefore(placeholder, template);
      }

      let mountedBody = null;

      const detach = () => {
        mountedBody?.remove();
        mountedBody = null;
        if (!placeholder.parentElement) details.insertBefore(placeholder, closeRow);
        syncLabels();
      };

      const mount = () => {
        if (mountedBody) return;
        placeholder.remove();
        mountedBody = document.createElement("div");
        mountedBody.className = "supplement-template-body";
        mountedBody.appendChild(template.content.cloneNode(true));
        details.insertBefore(mountedBody, closeRow);
        mountedBody.querySelectorAll("img").forEach((image) => {
          image.loading = "lazy";
          image.decoding = "async";
        });
        markSupplementSubheadings(mountedBody);
      };

      details.classList.add("has-lazy-supplement-body");
      detach();
      return { detach, mount };
    }

    const contentNodes = Array.from(details.children).filter((node) => (
      node.tagName !== "SUMMARY" && !node.classList.contains("supplement-close-row")
    ));
    const nodeCount = contentNodes.reduce((total, node) => total + node.querySelectorAll("*").length + 1, 0);
    if (nodeCount < 1500) return null;

    const fragment = document.createDocumentFragment();
    const placeholder = document.createElement("div");
    placeholder.className = "supplement-lazy-placeholder";
    let mounted = true;

    const detach = () => {
      if (!mounted) return;
      contentNodes.forEach((node) => fragment.appendChild(node));
      details.insertBefore(placeholder, closeRow);
      mounted = false;
      syncLabels();
    };

    const mount = () => {
      if (mounted) return;
      placeholder.remove();
      details.insertBefore(fragment, closeRow);
      mounted = true;
      markSupplementSubheadings(details);
    };

    detach();
    details.classList.add("has-lazy-supplement-body");
    return { detach, mount };
  };

  detailsList.forEach((details) => {
    if (details.querySelector(":scope > .supplement-close-row")) return;

    const row = document.createElement("div");
    row.className = "supplement-close-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "supplement-close-btn";
    button.addEventListener("click", () => {
      details.open = false;
      updateFocus();
      scheduleClosedAlignment(details);
    });

    row.appendChild(button);
    details.appendChild(row);

    details.querySelectorAll("img").forEach((image) => {
      image.loading = "lazy";
      image.decoding = "async";
    });

    const lazyBody = createLazyBody(details, row);

    details.addEventListener("toggle", () => {
      let shouldAlignOnOpen = false;
      if (details.open) {
        details.scrollTop = 0;
        detailsList.forEach((other) => {
          if (other !== details && other.open) {
            skipCloseRestore.add(other);
            other.open = false;
          }
        });
        alignDetailsToViewport(details);
        shouldAlignOnOpen = true;
        if (lazyBody) {
          details.classList.add("is-loading-supplement");
          window.setTimeout(() => {
            if (!details.open || !isVisible(details)) return;
            lazyBody.mount();
            details.classList.remove("is-loading-supplement");
            details.scrollTop = 0;
            scheduleOpenAlignment(details);
            updateFocus({ deferIndicator: true });
            window.setTimeout(updateScrollIndicator, 520);
            window.setTimeout(updateScrollIndicator, 980);
          }, 60);
        }
      } else {
        const shouldRestoreOnClose = !skipCloseRestore.has(details);
        skipCloseRestore.delete(details);
        if (lazyBody) {
          lazyBody.detach();
          details.classList.remove("is-loading-supplement");
        }
        updateFocus({ deferIndicator: shouldAlignOnOpen });
        if (shouldRestoreOnClose) scheduleClosedAlignment(details);
        return;
      }
      updateFocus({ deferIndicator: shouldAlignOnOpen });
      if (shouldAlignOnOpen) scheduleOpenAlignment(details);
    });
    details.addEventListener("scroll", requestScrollIndicatorUpdate, { passive: true });
  });

  backdrop.addEventListener("click", closeOpenDetails);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("supplement-focus-active")) {
      closeOpenDetails();
    }
  });
  window.addEventListener("resize", () => {
    updatePanelBounds();
    requestScrollIndicatorUpdate();
  });

  syncLabels();
  markSupplementSubheadings();
  updateFocus();

  new MutationObserver(() => {
    syncLabels();
    markSupplementSubheadings();
    updateFocus();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();

function rebuildBookmarks() {
  const list = document.getElementById("sectionBookmarkList");
  const current = document.getElementById("currentSectionLabel");
  if (!list || !current) return;

  const lang = document.documentElement.lang === "en" ? "en" : "ko";
  const activePanel = document.querySelector(`[data-lang-panel="${lang}"]`);
  const baseTargets = Array.from(document.querySelectorAll("[data-bookmark]"));
  const detailTargets = activePanel && !activePanel.classList.contains("is-collapsed")
    ? Array.from(activePanel.querySelectorAll(".deep-section h3"))
    : [];
  const targets = [
    ...baseTargets,
    ...detailTargets
  ].filter((target) => target.id || target.querySelector?.("[id]"));

  list.innerHTML = "";

  const entries = targets.map((target, index) => {
    const id = target.id || target.querySelector("[id]")?.id;
    const label = target.dataset?.bookmark
      ? (lang === "en" ? target.dataset.bookmarkEn || target.dataset.bookmark : target.dataset.bookmark)
      : target.textContent.trim();
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = label;
    link.className = target.dataset?.bookmark ? "bookmark-link" : "bookmark-link minor";
    link.dataset.index = String(index);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetEl = document.getElementById(id);
      if (!targetEl) return;
      const collapsedContent = targetEl.closest(".deep-dive-content.is-collapsed");
      if (collapsedContent) window.revealDeepDive?.();

      const topbar = document.querySelector(".topbar");
      const topOffset = (topbar?.getBoundingClientRect().height || 0) + 22;
      window.requestAnimationFrame(() => {
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - topOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      });
      history.replaceState(null, "", `#${id}`);
    });
    list.appendChild(link);
    return { id, label, node: document.getElementById(id), link };
  });

  const setActive = (entry) => {
    entries.forEach((item) => item.link.classList.toggle("active", item === entry));
    if (entry) current.textContent = entry.label;
  };

  const observer = new IntersectionObserver((observed) => {
    const visible = observed
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    const active = entries.find((entry) => entry.node === visible.target);
    if (active) setActive(active);
  }, {
    rootMargin: "-12% 0px -72% 0px",
    threshold: [0, 0.1, 0.35]
  });

  entries.forEach((entry) => {
    if (entry.node) observer.observe(entry.node);
  });

  if (entries.length) setActive(entries[0]);
}

(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !lightboxImg) return;

  const initialDevicePixelRatio = window.devicePixelRatio || 1;

  let lightboxScrollY = 0;
  const lockLightboxScroll = () => {
    if (document.body.classList.contains("lightbox-scroll-locked")) return;
    lightboxScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add("lightbox-scroll-locked");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lightboxScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
  };
  const unlockLightboxScroll = () => {
    if (!document.body.classList.contains("lightbox-scroll-locked")) return;
    document.body.classList.remove("lightbox-scroll-locked");
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
    window.scrollTo({ left: 0, top: lightboxScrollY, behavior: "auto" });
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  };
  const stopLightboxScroll = (event) => {
    if (lightbox.classList.contains("open")) event.preventDefault();
  };

  const getLightboxPageScale = () => {
    const currentDevicePixelRatio = window.devicePixelRatio || initialDevicePixelRatio;
    const dprScale = currentDevicePixelRatio / initialDevicePixelRatio;
    const viewportScale = window.visualViewport?.scale || 1;
    const totalScale = Math.max(0.001, dprScale * viewportScale);
    return 1 / totalScale;
  };
  const applyLightboxPageScale = () => {
    lightbox.style.setProperty("--lightbox-page-scale", String(getLightboxPageScale()));
  };
  const resetLightboxPageScale = () => {
    lightbox.style.setProperty("--lightbox-page-scale", "1");
  };

  const lightboxZoomState = {
    scale: 1,
    x: 0,
    y: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    suppressClick: false
  };
  const applyLightboxZoom = () => {
    lightbox.style.setProperty("--lightbox-zoom", String(lightboxZoomState.scale));
    lightbox.style.setProperty("--lightbox-pan-x", `${lightboxZoomState.x}px`);
    lightbox.style.setProperty("--lightbox-pan-y", `${lightboxZoomState.y}px`);
    lightbox.classList.toggle("is-zoomed", lightboxZoomState.scale > 1);
  };
  const resetLightboxZoom = () => {
    lightboxZoomState.scale = 1;
    lightboxZoomState.x = 0;
    lightboxZoomState.y = 0;
    lightboxZoomState.dragging = false;
    lightboxZoomState.suppressClick = false;
    applyLightboxZoom();
  };
  const setLightboxScale = (scale) => {
    const nextScale = Math.min(5, Math.max(1, scale));
    lightboxZoomState.scale = nextScale < 1.015 ? 1 : nextScale;
    if (lightboxZoomState.scale === 1) {
      lightboxZoomState.x = 0;
      lightboxZoomState.y = 0;
      lightboxZoomState.dragging = false;
    }
    applyLightboxZoom();
  };
  let gestureStartScale = 1;
  const handleLightboxWheel = (event) => {
    if (!lightbox.classList.contains("open")) return;
    event.preventDefault();
    if (event.ctrlKey) {
      const zoomFactor = Math.exp(-event.deltaY * 0.01);
      setLightboxScale(lightboxZoomState.scale * zoomFactor);
      return;
    }
    if (lightboxZoomState.scale > 1) {
      lightboxZoomState.x -= event.deltaX;
      lightboxZoomState.y -= event.deltaY;
      applyLightboxZoom();
    }
  };
  const handleGestureStart = (event) => {
    if (!lightbox.classList.contains("open")) return;
    event.preventDefault();
    gestureStartScale = lightboxZoomState.scale;
  };
  const handleGestureChange = (event) => {
    if (!lightbox.classList.contains("open")) return;
    event.preventDefault();
    setLightboxScale(gestureStartScale * event.scale);
  };
  document.addEventListener("click", (event) => {
    if (event.target.closest(".copy-block-button")) return;
    const img = event.target.closest(".post-body figure.image img");
    if (!img || img.closest(".deep-dive-content.is-collapsed")) return;
    event.preventDefault();
    applyLightboxPageScale();
    resetLightboxZoom();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "preview";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lockLightboxScroll();
  });

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    resetLightboxZoom();
    resetLightboxPageScale();
    lightboxImg.removeAttribute("src");
    unlockLightboxScroll();
  };

  closeBtn?.addEventListener("click", close);
  lightboxImg.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    lightboxZoomState.suppressClick = false;
  });
  lightboxImg.addEventListener("pointerdown", (event) => {
    if (lightboxZoomState.scale <= 1) return;
    lightboxZoomState.dragging = true;
    lightboxZoomState.startX = event.clientX;
    lightboxZoomState.startY = event.clientY;
    lightboxZoomState.originX = lightboxZoomState.x;
    lightboxZoomState.originY = lightboxZoomState.y;
    lightboxZoomState.suppressClick = false;
    lightboxImg.setPointerCapture?.(event.pointerId);
  });
  lightboxImg.addEventListener("pointermove", (event) => {
    if (!lightboxZoomState.dragging) return;
    const dx = event.clientX - lightboxZoomState.startX;
    const dy = event.clientY - lightboxZoomState.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) lightboxZoomState.suppressClick = true;
    lightboxZoomState.x = lightboxZoomState.originX + dx;
    lightboxZoomState.y = lightboxZoomState.originY + dy;
    applyLightboxZoom();
  });
  const endLightboxDrag = (event) => {
    if (!lightboxZoomState.dragging) return;
    lightboxZoomState.dragging = false;
    lightboxImg.releasePointerCapture?.(event.pointerId);
  };
  lightboxImg.addEventListener("pointerup", endLightboxDrag);
  lightboxImg.addEventListener("pointercancel", endLightboxDrag);

  lightbox.addEventListener("wheel", handleLightboxWheel, { passive: false });
  lightbox.addEventListener("touchmove", stopLightboxScroll, { passive: false });
  lightbox.addEventListener("gesturestart", handleGestureStart, { passive: false });
  lightbox.addEventListener("gesturechange", handleGestureChange, { passive: false });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) close();
  });
})();

(() => {
  document.querySelectorAll(".notion-text-equation-token").forEach((token) => {
    const next = token.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE && next.textContent?.startsWith(",")) {
      token.insertAdjacentText("afterend", ",");
      next.textContent = next.textContent.slice(1);
    }
  });
})();


(() => {
  const KATEX_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js";
  let katexLoadPromise = null;

  const ensureKatex = () => {
    if (window.katex) return Promise.resolve(window.katex);
    if (katexLoadPromise) return katexLoadPromise;

    katexLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-katex-runtime="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.katex), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = KATEX_SCRIPT_URL;
      script.async = true;
      script.dataset.katexRuntime = "true";
      script.onload = () => resolve(window.katex);
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return katexLoadPromise;
  };

  const renderInlineTokens = (root = document) => {
    if (!window.katex) return;
    root.querySelectorAll("[data-tex-inline]").forEach((token) => {
      if (token.dataset.katexRendered === "true") return;
      const tex = token.dataset.texInline;
      if (!tex) return;
      try {
        window.katex.render(tex, token, {
          displayMode: false,
          throwOnError: false,
          strict: "ignore",
          trust: true
        });
        token.dataset.katexRendered = "true";
        token.classList.add("katex-source-rendered");
      } catch (error) {
        token.dataset.katexRendered = "error";
      }
    });
  };

  const renderDisplayTokens = (root = document) => {
    if (!window.katex) return;
    root.querySelectorAll("figure.equation[data-tex-display]").forEach((figure) => {
      if (figure.dataset.katexRendered === "true") return;
      const tex = figure.dataset.texDisplay;
      const target = figure.querySelector(".equation-main") || figure.querySelector(".equation-render");
      if (!tex || !target) return;
      try {
        window.katex.render(tex, target, {
          displayMode: true,
          throwOnError: false,
          strict: "ignore",
          trust: true
        });
        figure.dataset.katexRendered = "true";
        figure.classList.add("katex-display-source-rendered");
      } catch (error) {
        figure.dataset.katexRendered = "error";
      }
    });
  };

  const renderLocalKatexTokens = (root = document) => {
    ensureKatex()
      .then(() => {
        renderInlineTokens(root);
        renderDisplayTokens(root);
        window.syncEquationSideTags?.(root);
      })
      .catch(() => {});
  };

  window.renderLocalKatexTokens = renderLocalKatexTokens;
  renderLocalKatexTokens();

  const postBody = document.querySelector(".post-body") || document.body;
  if (postBody) {
    const observer = new MutationObserver((mutations) => {
      const shouldRender = mutations.some((mutation) =>
        [...mutation.addedNodes].some((node) =>
          node.nodeType === Node.ELEMENT_NODE && (
            node.matches?.("[data-tex-inline], figure.equation[data-tex-display]") ||
            node.querySelector?.("[data-tex-inline], figure.equation[data-tex-display]")
          )
        )
      );
      if (shouldRender) renderLocalKatexTokens(postBody);
    });
    observer.observe(postBody, { childList: true, subtree: true });
  }
})();

// Paper asset copy affordance: equations, figures, and tables keep useful clipboard formats.
(() => {
  const postBody = document.querySelector(".post-body");
  if (!postBody) return;

  const statusDelay = 1200;
  const mathSelector = [
    ".notion-text-equation-token",
    ".inline-math",
    ".inline-equation-token",
    ".math-token",
    ".model-token",
    ".state-token",
    ".equation-token",
    ".formula-token",
    ".equation-chip-part",
    "[data-tex-inline]"
  ].join(", ");

  const cleanText = (value) => (value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\u200b/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const escapeHtml = (value) => cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const texFromNode = (node) => {
    if (!node) return "";
    if (node.dataset?.texInline) return node.dataset.texInline;
    if (node.dataset?.texDisplay) return node.dataset.texDisplay;
    const annotation = node.querySelector?.('annotation[encoding="application/x-tex"]');
    if (annotation?.textContent) return annotation.textContent;
    const text = cleanText(node.textContent);
    const inlineMatch = text.match(/^\\\((.*)\\\)$/s);
    if (inlineMatch) return inlineMatch[1];
    const displayMatch = text.match(/^\$\$(.*)\$\$$/s);
    if (displayMatch) return displayMatch[1];
    return text;
  };

  const normalizeInlineTex = (tex) => {
    const cleaned = cleanText(tex)
      .replace(/^\\\(\s*/s, "")
      .replace(/\s*\\\)$/s, "")
      .replace(/^\$\$\s*/s, "")
      .replace(/\s*\$\$$/s, "")
      .replace(/^\$\s*/s, "")
      .replace(/\s*\$$/s, "")
      .replace(/\\tag\{[^{}]+\}/g, "")
      .trim();
    return cleaned ? `$$${cleaned}$$` : "";
  };

  const normalizeDisplayTex = (tex) => {
    const cleaned = cleanText(tex)
      .replace(/^\$\$\s*/s, "")
      .replace(/\s*\$\$$/s, "")
      .replace(/^\\\[\s*/s, "")
      .replace(/\s*\\\]$/s, "")
      .replace(/\\tag\{([^{}]+)\}/g, (_, tag) => `\\qquad \\text{(${tag})}`)
      .trim();
    return cleaned ? `$$${cleaned}$$` : "";
  };

  const replaceMathInClone = (clone) => {
    clone.querySelectorAll?.(mathSelector).forEach((node) => {
      const tex = texFromNode(node);
      const replacement = tex ? normalizeInlineTex(tex) : cleanText(node.textContent);
      node.replaceWith(document.createTextNode(replacement));
    });
  };

  const textWithMath = (element) => {
    if (!element) return "";
    const clone = element.cloneNode(true);
    clone.querySelectorAll?.(".copy-block-button").forEach((node) => node.remove());
    replaceMathInClone(clone);
    return cleanText(clone.textContent);
  };

  const absoluteImageSources = (clone) => {
    clone.querySelectorAll?.("img").forEach((img) => {
      const source = img.getAttribute("src") || img.currentSrc || img.src;
      if (!source) return;
      try {
        img.setAttribute("src", new URL(source, window.location.href).href);
      } catch (_) {
        img.setAttribute("src", source);
      }
      img.removeAttribute("srcset");
    });
  };

  const fallbackCopyText = (text) => {
    let handled = false;
    const listener = (event) => {
      event.clipboardData?.setData("text/plain", text || "");
      event.preventDefault();
      handled = true;
    };
    document.addEventListener("copy", listener, { once: true });
    const ok = document.execCommand("copy");
    document.removeEventListener("copy", listener);
    if (!ok || !handled) throw new Error("copy command failed");
  };

  const fallbackCopyHtml = (plain, html) => {
    let handled = false;
    const listener = (event) => {
      if (html) event.clipboardData?.setData("text/html", html);
      event.clipboardData?.setData("text/plain", plain || "");
      event.preventDefault();
      handled = true;
    };
    document.addEventListener("copy", listener, { once: true });
    const ok = document.execCommand("copy");
    document.removeEventListener("copy", listener);
    if (!ok || !handled) throw new Error("html copy command failed");
  };

  const writeClipboard = async ({ plain, html, imageBlob }) => {
    const safePlain = plain || "";
    if (navigator.clipboard?.write && window.ClipboardItem && imageBlob) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": imageBlob })]);
        return;
      } catch (_) {}
    }
    if (navigator.clipboard?.write && window.ClipboardItem && html) {
      try {
        const item = new ClipboardItem({
          "text/plain": new Blob([safePlain], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" })
        });
        await navigator.clipboard.write([item]);
        return;
      } catch (_) {}
    }
    if (html) {
      try {
        fallbackCopyHtml(safePlain, html);
        return;
      } catch (_) {}
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(safePlain);
        return;
      } catch (_) {}
    }
    fallbackCopyText(safePlain);
  };

  const tableToTsv = (table) => Array.from(table.rows)
    .map((row) => Array.from(row.cells)
      .map((cell) => textWithMath(cell).replace(/\t/g, " "))
      .join("\t"))
    .join("\n");

  const tableToHtml = (table) => {
    const clone = table.cloneNode(true);
    clone.querySelectorAll(".copy-block-button").forEach((node) => node.remove());
    replaceMathInClone(clone);
    return clone.outerHTML;
  };

  const figureCaptionText = (figure) => textWithMath(figure.querySelector("figcaption"));

  const imageSourceForCopy = (figure) => {
    const img = figure.querySelector("img");
    if (!img) return "";
    let src = img.currentSrc || img.getAttribute("src") || img.src || "";
    try {
      src = new URL(src, window.location.href).href;
    } catch (_) {}
    return src;
  };

  const figureToHtml = (figure, imageDataUrl) => {
    const img = figure.querySelector("img");
    if (!img) return "";
    const src = imageDataUrl || imageSourceForCopy(figure);
    const alt = img.getAttribute("alt") || figureCaptionText(figure) || "figure";
    if (!src) return "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto;display:block;" />`;
  };

  const imageToPngBlob = async (figure) => {
    try {
      const img = figure.querySelector("img");
      if (!img) return null;
      if (!img.complete || !img.naturalWidth) {
        await new Promise((resolve, reject) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", reject, { once: true });
        });
      }
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height) return null;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(img, 0, 0, width, height);
      return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    } catch (_) {
      return null;
    }
  };

  const blobToDataUrl = (blob) => new Promise((resolve) => {
    if (!blob) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(blob);
  });

  const figureToMarkdown = (figure) => imageSourceForCopy(figure);

  const equationPayload = (figure) => {
    const tex = normalizeDisplayTex(
      figure.dataset.texDisplay ||
      texFromNode(figure.querySelector(".equation-main-original")) ||
      texFromNode(figure.querySelector(".equation-main")) ||
      texFromNode(figure)
    );
    return { plain: tex };
  };

  const figurePayload = async (figure) => {
    const imageBlob = await imageToPngBlob(figure);
    const imageDataUrl = await blobToDataUrl(imageBlob);
    return {
      plain: figureToMarkdown(figure),
      html: figureToHtml(figure, imageDataUrl),
      imageBlob
    };
  };

  const installButton = (target, label, getPayload) => {
    if (!target || target.querySelector(":scope > .copy-block-button")) return;
    target.classList.add("copyable-block");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-block-button";
    button.innerHTML = '<span class="copy-icon" aria-hidden="true"></span><span class="copy-status" aria-live="polite">Copy</span>';
    button.dataset.copyState = "idle";
    button.setAttribute("aria-label", `${label} copy`);
    const status = button.querySelector(".copy-status");
    const setButtonState = (state, text) => {
      button.dataset.copyState = state;
      if (status) status.textContent = text;
      button.setAttribute("aria-label", `${label} ${text.toLowerCase()}`);
    };
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.disabled = true;
      try {
        await writeClipboard(await getPayload());
        setButtonState("copied", "Copied");
        button.classList.add("is-copied");
      } catch (_) {
        setButtonState("failed", "Failed");
        button.classList.add("is-failed");
      } finally {
        window.setTimeout(() => {
          button.disabled = false;
          setButtonState("idle", "Copy");
          button.classList.remove("is-copied", "is-failed");
        }, statusDelay);
      }
    });
    target.appendChild(button);
  };

  const ensureImageCopyFrame = (figure) => {
    const img = figure.querySelector("img");
    if (!img) return null;
    const existing = img.closest(".copy-image-frame");
    if (existing && figure.contains(existing)) return existing;
    const frame = document.createElement("span");
    frame.className = "copy-image-frame";
    img.parentNode.insertBefore(frame, img);
    frame.appendChild(img);
    return frame;
  };

  postBody.querySelectorAll("figure.image").forEach((figure) => {
    const imageFrame = ensureImageCopyFrame(figure);
    if (!imageFrame) return;
    installButton(imageFrame, "figure", () => figurePayload(figure));
  });

  const tableTargets = new Set();
  postBody.querySelectorAll("table").forEach((table) => {
    const target = table.closest(".summary-table-wrap") || table;
    if (tableTargets.has(target)) return;
    tableTargets.add(target);
    installButton(target, "table", () => ({
      plain: tableToTsv(table),
      html: tableToHtml(table)
    }));
  });
})();
