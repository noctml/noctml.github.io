(() => {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  try { window.localStorage.removeItem("theme"); } catch {
    // Storage can be unavailable for local file previews.
  }
})();

(() => {
  const langBtn = document.getElementById("langBtn");
  if (!langBtn) return;

  const root = document.documentElement;
  const skip = document.querySelector(".skip");
  const deepDiveTitle = document.getElementById("deep-dive-title");
  const deepDiveNote = document.querySelector(".deep-dive-note");
  const revealBtn = document.getElementById("deepDiveMoreBtn");
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
  const wrap = document.getElementById("deepDiveMore");
  const button = document.getElementById("deepDiveMoreBtn");
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
    if (lb.classList.contains("open")) event.preventDefault();
  };

  const getLightboxPageScale = () => {
    const currentDevicePixelRatio = window.devicePixelRatio || initialDevicePixelRatio;
    const dprScale = currentDevicePixelRatio / initialDevicePixelRatio;
    const viewportScale = window.visualViewport?.scale || 1;
    const totalScale = Math.max(0.001, dprScale * viewportScale);
    return 1 / totalScale;
  };
  const applyLightboxPageScale = () => {
    lb.style.setProperty("--lightbox-page-scale", String(getLightboxPageScale()));
  };
  const resetLightboxPageScale = () => {
    lb.style.setProperty("--lightbox-page-scale", "1");
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
    lb.style.setProperty("--lightbox-zoom", String(lightboxZoomState.scale));
    lb.style.setProperty("--lightbox-pan-x", `${lightboxZoomState.x}px`);
    lb.style.setProperty("--lightbox-pan-y", `${lightboxZoomState.y}px`);
    lb.classList.toggle("is-zoomed", lightboxZoomState.scale > 1);
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
    if (!lb.classList.contains("open")) return;
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
    if (!lb.classList.contains("open")) return;
    event.preventDefault();
    gestureStartScale = lightboxZoomState.scale;
  };
  const handleGestureChange = (event) => {
    if (!lb.classList.contains("open")) return;
    event.preventDefault();
    setLightboxScale(gestureStartScale * event.scale);
  };
  const open = (src) => {
    applyLightboxPageScale();
    resetLightboxZoom();
    lbImg.src = src;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    lockLightboxScroll();
  };

  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    resetLightboxZoom();
    resetLightboxPageScale();
    lbImg.src = "";
    unlockLightboxScroll();
  };

  lbClose?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  lbImg.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    lightboxZoomState.suppressClick = false;
  });
  lbImg.addEventListener("pointerdown", (event) => {
    if (lightboxZoomState.scale <= 1) return;
    lightboxZoomState.dragging = true;
    lightboxZoomState.startX = event.clientX;
    lightboxZoomState.startY = event.clientY;
    lightboxZoomState.originX = lightboxZoomState.x;
    lightboxZoomState.originY = lightboxZoomState.y;
    lightboxZoomState.suppressClick = false;
    lbImg.setPointerCapture?.(event.pointerId);
  });
  lbImg.addEventListener("pointermove", (event) => {
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
    lbImg.releasePointerCapture?.(event.pointerId);
  };
  lbImg.addEventListener("pointerup", endLightboxDrag);
  lbImg.addEventListener("pointercancel", endLightboxDrag);

  lb.addEventListener("wheel", handleLightboxWheel, { passive: false });
  lb.addEventListener("touchmove", stopLightboxScroll, { passive: false });
  lb.addEventListener("gesturestart", handleGestureStart, { passive: false });
  lb.addEventListener("gesturechange", handleGestureChange, { passive: false });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".copy-block-button")) return;
    const img = event.target.closest(".post-body figure.image img");
    if (!img || img.closest(".deep-dive-content.is-collapsed")) return;
    event.preventDefault();
    open(img.currentSrc || img.src);
  });

  lb.addEventListener("click", (event) => {
    if (event.target === lb) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
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
