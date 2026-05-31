(() => {
  const root = document.documentElement;

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

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const themes = ["light", "dark-gray", "dark"];
  const themeLabels = {
    light: "Light",
    "dark-gray": "Dark gray",
    dark: "Dark"
  };
  const themeIcons = {
    light: "☀",
    "dark-gray": "◐",
    dark: "☾"
  };

  let currentTheme = themes.includes(storageGet("theme")) ? storageGet("theme") : "light";

  const applyTheme = (theme, persist = true) => {
    currentTheme = themes.includes(theme) ? theme : "light";
    if (currentTheme === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", currentTheme);
    }
    if (persist) storageSet("theme", currentTheme);
    if (themeIcon) themeIcon.textContent = themeIcons[currentTheme];
    if (themeBtn) {
      const label = `${themeLabels[currentTheme]} theme`;
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    }
  };

  applyTheme(currentTheme, false);

  themeBtn?.addEventListener("click", () => {
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  });
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
            window.syncEquationSideTags?.(details);
            details.classList.remove("is-loading-supplement");
            details.scrollTop = 0;
            scheduleOpenAlignment(details);
            updateFocus({ deferIndicator: true });
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

  document.querySelectorAll(".post-body img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "preview";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
  };

  closeBtn?.addEventListener("click", close);
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
  const collectAnnotationTags = (figure) => {
    const annotation = figure.querySelector('annotation[encoding="application/x-tex"]');
    const tex = annotation?.textContent || "";
    const tags = [];
    const seen = new Set();
    const patterns = [
      /\\tag\{([^}]+)\}/g,
      /\\qquad\s*\(?([0-9]+)\)?/g
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(tex))) {
        const tag = (match[1] || "").trim();
        if (tag && !seen.has(tag)) {
          seen.add(tag);
          tags.push(tag);
        }
      }
    });

    return tags;
  };

  const collectEquationTags = (figure) => {
    const explicitTags = figure.dataset.equationTags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return explicitTags?.length ? explicitTags : collectAnnotationTags(figure);
  };

  const nearestMathAtom = (node) => {
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element?.closest(".mopen, .mord, .mclose, .mpunct") || element;
  };

  const hidePreviousSpacing = (element) => {
    let current = element?.previousElementSibling;
    while (current && current.style.display === "none") {
      current = current.previousElementSibling;
    }
    if (current?.classList.contains("mspace")) {
      current.style.display = "none";
      current = current.previousElementSibling;
    }
    if (current?.classList.contains("mpunct") && current.textContent.trim() === ",") {
      current.style.display = "none";
    }
  };

  const hideVisibleTag = (root, tag) => {
    const target = `(${tag})`;
    const text = root.textContent || "";
    const start = text.indexOf(target);
    if (start < 0) return;

    const end = start + target.length;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const touched = [];
    let cursor = 0;
    let node;

    while ((node = walker.nextNode())) {
      const value = node.nodeValue || "";
      const nodeStart = cursor;
      const nodeEnd = cursor + value.length;
      cursor = nodeEnd;

      if (nodeEnd <= start || nodeStart >= end) continue;

      const localStart = Math.max(0, start - nodeStart);
      const localEnd = Math.min(value.length, end - nodeStart);
      node.nodeValue = `${value.slice(0, localStart)}${value.slice(localEnd)}`;
      const atom = nearestMathAtom(node);
      if (atom) touched.push(atom);
    }

    touched.forEach((atom, index) => {
      if (index === 0) hidePreviousSpacing(atom);
      if (!atom.textContent.trim()) atom.style.display = "none";
    });
  };

  const syncEquationSideTags = (scope = document) => {
    scope.querySelectorAll("figure.equation").forEach((figure) => {
    if (figure.classList.contains("slim-vdb-closed-form-equation")) return;
    if (figure.querySelector(".equation-side-tag, .equation-side-tags")) return;

    const tags = collectEquationTags(figure);
    if (!tags.length) return;

    const katexHtml = figure.querySelector(".katex-html");
    if (!katexHtml) return;

    const tagsToHide = [...new Set([...collectAnnotationTags(figure), ...tags])];
    tagsToHide.forEach((tag) => hideVisibleTag(katexHtml, tag));

    figure.classList.add("equation-tag-gutter");
    const side = document.createElement("span");
    side.setAttribute("aria-hidden", "true");

    if (tags.length === 1) {
      side.className = "equation-side-tag";
      side.textContent = `(${tags[0]})`;
    } else {
      side.className = "equation-side-tags";
      tags.forEach((tag) => {
        const tagNode = document.createElement("span");
        tagNode.className = "equation-side-tag";
        tagNode.textContent = `(${tag})`;
        side.appendChild(tagNode);
      });
    }

    figure.appendChild(side);
  });
  };

  window.syncEquationSideTags = syncEquationSideTags;
  syncEquationSideTags();
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
