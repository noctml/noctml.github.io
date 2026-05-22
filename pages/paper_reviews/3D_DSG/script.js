(() => {
  const root = document.documentElement;
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

  const saved = localStorage.getItem("theme");
  let currentTheme = themes.includes(saved) ? saved : "light";

  const applyTheme = (theme, persist = true) => {
    currentTheme = themes.includes(theme) ? theme : "light";
    if (currentTheme === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", currentTheme);

    if (persist) localStorage.setItem("theme", currentTheme);
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
  const langBtn = document.getElementById("langBtn");
  if (!langBtn) return;

  const root = document.documentElement;
  const skip = document.querySelector(".skip");
  const deepDiveTitle = document.getElementById("deep-dive-title");
  const deepDiveNote = document.querySelector(".deep-dive-note");
  const revealBtn = document.getElementById("deepDiveReveal");
  const commentsTitle = document.getElementById("commentsTitle");
  const giscusScript = document.querySelector(".comments script[src*=\"giscus\"]");

  let currentLang = root.lang === "en" ? "en" : "ko";

  const setText = (el, lang) => {
    if (!el) return;
    const value = el.dataset[lang];
    if (value) el.textContent = value;
  };

  const applyLanguage = (lang) => {
    currentLang = lang === "en" ? "en" : "ko";
    root.lang = currentLang;
    root.dataset.pageLang = currentLang;
    langBtn.dataset.lang = currentLang;
    langBtn.setAttribute("aria-label", currentLang === "ko" ? "Switch to English" : "한국어로 전환");
    langBtn.setAttribute("title", currentLang === "ko" ? "Switch to English" : "한국어로 전환");

    document.querySelectorAll("[data-lang-block]").forEach((el) => {
      el.hidden = el.dataset.langBlock !== currentLang;
    });

    setText(deepDiveTitle, currentLang);
    setText(deepDiveNote, currentLang);
    if (revealBtn) {
      revealBtn.textContent = currentLang === "ko" ? "더보기" : "Read More";
      const activeContent = document.querySelector(`.deep-dive-content[data-lang-block="${currentLang}"]`);
      if (activeContent) revealBtn.setAttribute("aria-controls", activeContent.id);
    }
    if (commentsTitle) commentsTitle.textContent = currentLang === "ko" ? "Comments" : "Comments";
    if (skip) skip.textContent = currentLang === "ko" ? "본문으로 바로가기" : "Skip to main content";
    if (giscusScript) giscusScript.dataset.lang = currentLang;

    document.dispatchEvent(new CustomEvent("paper-lang-change", { detail: { lang: currentLang } }));
  };

  langBtn.addEventListener("click", () => {
    applyLanguage(currentLang === "ko" ? "en" : "ko");
  });

  applyLanguage(currentLang);
})();

(() => {
  const contents = Array.from(document.querySelectorAll(".deep-dive-content"));
  const wrap = document.getElementById("deepDiveRevealWrap");
  const button = document.getElementById("deepDiveReveal");
  const body = wrap?.closest(".deep-dive-body");
  if (!contents.length || !wrap || !button) return;

  const activeContent = () => contents.find((content) => !content.hidden) || contents[0];

  const syncRevealState = () => {
    const active = activeContent();
    const collapsed = Boolean(active?.classList.contains("is-collapsed"));
    body?.classList.toggle("has-collapsed-active", collapsed);
    wrap.classList.toggle("is-visible", collapsed);
    wrap.hidden = !collapsed;
    wrap.setAttribute("aria-hidden", String(!collapsed));
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    if (active?.id) button.setAttribute("aria-controls", active.id);
  };

  const reveal = () => {
    contents.forEach((content) => content.classList.remove("is-collapsed"));
    syncRevealState();
    document.dispatchEvent(new CustomEvent("paper-deep-dive-reveal"));
  };

  contents.forEach((content) => content.classList.add("is-collapsed"));
  syncRevealState();
  button.addEventListener("click", reveal);
  window.addEventListener("pageshow", syncRevealState);
  window.revealDeepDive = reveal;
  window.syncDeepDiveReveal = syncRevealState;
  document.addEventListener("paper-lang-change", syncRevealState);
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


(() => {
  const post = document.querySelector(".post-body");
  const sidebarList = document.getElementById("sectionBookmarkList");
  const currentLabel = document.getElementById("currentSectionLabel");
  if (!post || !sidebarList || !currentLabel) return;

  let sections = [];
  let links = [];
  let lockedSection = null;
  let unlockTimer = 0;
  let activeSectionId = "";
  let ticking = false;

  const normalizeLabel = (text) => text.replace(/\s+/g, " ").trim();
  const isVisible = (el) => !el.closest("[hidden]");
  const topOffset = () => {
    const topbar = document.querySelector(".topbar");
    return (topbar?.getBoundingClientRect().height || 0) + 22;
  };

  const ensureBookmarkVisible = (link) => {
    const listRect = sidebarList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const pad = 8;

    if (linkRect.top < listRect.top + pad) {
      sidebarList.scrollTop -= (listRect.top + pad) - linkRect.top;
    } else if (linkRect.bottom > listRect.bottom - pad) {
      sidebarList.scrollTop += linkRect.bottom - (listRect.bottom - pad);
    }
  };

  const setActive = (active) => {
    if (!active) return;
    currentLabel.textContent = active.label;
    let activeLink = null;
    links.forEach((link) => {
      const isActive = link.dataset.targetSection === active.id;
      link.classList.toggle("active", isActive);
      if (isActive) activeLink = link;
    });
    if (activeLink && activeSectionId !== active.id) {
      activeSectionId = active.id;
      ensureBookmarkVisible(activeLink);
    }
  };

  const collectHeadings = () => {
    const selector = [
      ".paper-map:not([hidden]) h2",
      ".deep-dive > h2",
      ".deep-dive-content:not([hidden]) h3[id]",
      ".deep-dive-content:not([hidden]) blockquote[id]"
    ].join(", ");

    return Array.from(post.querySelectorAll(selector)).filter((el) => {
      const label = normalizeLabel(el.textContent || "");
      return label && isVisible(el) && !el.closest("details") && !el.closest(".deep-dive-content.is-collapsed");
    });
  };

  const build = () => {
    sidebarList.innerHTML = "";
    sections = collectHeadings().map((el, index) => {
      if (!el.id) el.id = `paper-section-${index + 1}`;
      const label = normalizeLabel(el.textContent || "");
      const level = el.matches("blockquote") ? "minor" : "major";
      return { el, id: el.id, label, level };
    });

    links = sections.map((section, index) => {
      const link = document.createElement("a");
      link.className = `bookmark-link ${section.level}`;
      link.href = `#${section.id}`;
      link.textContent = section.label;
      link.dataset.targetSection = section.id;
      sidebarList.appendChild(link);

      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (section.el.closest(".deep-dive-content.is-collapsed")) {
          window.revealDeepDive?.();
        }

        const targetTop = section.el.getBoundingClientRect().top + window.pageYOffset - topOffset();
        lockedSection = section;
        window.clearTimeout(unlockTimer);
        setActive(section);

        window.scrollTo({ top: targetTop, behavior: "smooth" });
        history.replaceState(null, "", `#${section.id}`);
        unlockTimer = window.setTimeout(() => {
          lockedSection = null;
          update();
        }, 900);
      });

      return link;
    });

    activeSectionId = "";
    setActive(sections[0]);
    update();
  };

  const update = () => {
    ticking = false;
    if (!sections.length) return;
    const probeY = topOffset() + 8;

    if (lockedSection) {
      setActive(lockedSection);
      const distance = Math.abs(lockedSection.el.getBoundingClientRect().top - topOffset());
      if (distance > 3) return;
      window.clearTimeout(unlockTimer);
      lockedSection = null;
    }

    let active = sections[0];
    for (const section of sections) {
      const top = section.el.getBoundingClientRect().top;
      if (top <= probeY) active = section;
      else break;
    }
    setActive(active);
  };

  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  document.addEventListener("paper-lang-change", build);
  document.addEventListener("paper-deep-dive-reveal", build);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  build();
})();

(() => {
  const splitTopLevelCommas = (tex) => {
    const parts = [];
    let buffer = "";
    let depth = 0;

    for (const char of tex) {
      if ("([{".includes(char)) depth += 1;
      if (")]}".includes(char)) depth = Math.max(0, depth - 1);
      if (char === "," && depth === 0) {
        parts.push(buffer.trim());
        buffer = "";
      } else {
        buffer += char;
      }
    }

    if (buffer.trim()) parts.push(buffer.trim());
    return parts;
  };

  const prettifyTex = (tex) => tex
    .replace(/\\_/g, "_")
    .replace(/_\{([^{}]+)\}/g, "_$1")
    .replace(/\^\{([^{}]+)\}/g, "^$1")
    .replace(/\\(?:mathrm|mathit|text)\{([^{}]*)\}/g, "$1")
    .replace(/\\,/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const enhanceInlineEquationCommas = () => {
    document.querySelectorAll(".notion-text-equation-token").forEach((token) => {
      if (token.classList.contains("equation-split-source")) return;
      if (token.closest("figure.equation, .equation-container, .katex-display")) return;

      const annotation = token.querySelector('annotation[encoding="application/x-tex"]');
      const tex = annotation?.textContent?.trim();
      if (!tex || !tex.includes(",")) return;

      const parts = splitTopLevelCommas(tex).filter(Boolean);
      if (parts.length < 2) return;

      const group = document.createElement("span");
      group.className = "equation-chip-group";
      group.setAttribute("aria-label", prettifyTex(tex));

      parts.forEach((part, index) => {
        if (index > 0) {
          const comma = document.createElement("span");
          comma.className = "equation-chip-comma";
          comma.setAttribute("aria-hidden", "true");
          comma.textContent = ",";
          group.appendChild(comma);
        }

        const chip = document.createElement("span");
        chip.className = "equation-chip-part";
        chip.textContent = prettifyTex(part);
        group.appendChild(chip);
      });

      token.classList.add("equation-split-source");
      token.setAttribute("aria-hidden", "true");
      token.after(group);
    });
  };

  enhanceInlineEquationCommas();
  document.addEventListener("paper-lang-change", enhanceInlineEquationCommas);
})();

(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose");
  if (!lb || !lbImg) return;

  const open = (src) => {
    lbImg.src = src;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  lbClose?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  document.addEventListener("click", (event) => {
    const img = event.target.closest(".post-body img");
    if (!img) return;
    event.preventDefault();
    open(img.src);
  });

  lb.addEventListener("click", (event) => {
    if (event.target === lb) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();
