(() => {
  const data = window.SITE_DATA || {};
  const papers = sortByDate(data.paperSummaries || []);
  const reviews = sortByDate(data.paperReviews || []);
  const studies = sortByDate(data.study || data.studies || []);
  const projects = sortByDate(data.projects || []);
  let activeTags = Array.from(new Set(
    new URLSearchParams(window.location.search)
      .getAll("tag")
      .map((tag) => tag.trim())
      .filter(Boolean)
  ));
  const filterRenderers = [];

  const navArea = document.body?.dataset?.area || "";
  document.querySelectorAll("[data-nav-area]").forEach((link) => {
    if (link.dataset.navArea === navArea) link.classList.add("is-active");
  });

  renderPapers();
  renderReviews();
  renderStudy();
  renderProjects();
  setupSidebarCounts();
  setupHomeViewSwitch();
  setupTagControls();
  renderActiveTagFilters();

  function sortByDate(items) {
    return items.slice().sort((a, b) => dateValue(b.date) - dateValue(a.date));
  }

  function dateValue(value) {
    if (!value) return 0;
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
  }

  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  function safeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function safeAttr(value) {
    return safeText(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function formatDate(value) {
    if (!value) return "";
    const normalized = String(value).trim();
    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return normalized.replace(/-/g, ".");
    return `${match[1]}년 ${match[2]}월 ${match[3]}일`;
  }

  function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function filterByActiveTags(items) {
    if (!activeTags.length) return items;
    const normalizedTags = activeTags.map((tag) => tag.toLocaleLowerCase());
    return items.filter((item) => {
      const tags = (Array.isArray(item.tags) ? item.tags : [])
        .map((tag) => String(tag).toLocaleLowerCase());
      return normalizedTags.every((tag) => tags.includes(tag));
    });
  }

  function renderArchiveItems(items, renderer) {
    if (items.length) return items.map(renderer).join("");
    return `<p class="archive-filter-empty">선택한 태그 조합에 해당하는 게시물이 없습니다.</p>`;
  }

  function renderPapers() {
    const listEl = document.querySelector("[data-paper-list]");
    if (!listEl) return;

    const prevEl = document.getElementById("paperPrev");
    const nextEl = document.getElementById("paperNext");
    const infoEl = document.getElementById("paperPageInfo");
    const pageListEl = document.getElementById("paperPageList");
    const pagerEl = pageListEl?.closest(".pager");
    const mode = listEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const basePublished = papers.filter((item) => item.published !== false);
    const pageSize = parseNumber(listEl.dataset.pageSize, isPreview ? parseNumber(listEl.dataset.limit, 5) : 12);
    const limit = isPreview ? parseNumber(listEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const published = filterByActiveTags(basePublished);
      const scoped = isPreview ? published.slice(0, limit) : published;
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      listEl.innerHTML = renderArchiveItems(pageItems, renderPaperCard);

      if (infoEl) infoEl.textContent = `${pageIndex + 1} / ${total}`;
      if (pageListEl) renderPageNumbers(total);
      if (pagerEl) pagerEl.hidden = scoped.length === 0;
      if (prevEl) prevEl.disabled = pageIndex === 0;
      if (nextEl) nextEl.disabled = pageIndex >= total - 1;
      if (shouldAlignList) alignPaperListToTop();
    };

    const renderPageNumbers = (total) => {
      pageListEl.innerHTML = Array.from({ length: total }, (_, index) => {
        const active = index === pageIndex ? " is-active" : "";
        return `
          <button class="pager-page-btn${active}" type="button" data-paper-page="${index}" aria-label="Go to paper summary page ${index + 1}" aria-current="${index === pageIndex ? "page" : "false"}">
            ${index + 1}
          </button>
        `;
      }).join("");
    };

    const alignPaperListToTop = () => {
      requestAnimationFrame(() => {
        const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
        const nextTop = listEl.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      });
    };

    if (prevEl) {
      prevEl.addEventListener("click", () => {
        if (pageIndex === 0) return;
        pageIndex -= 1;
        render(true);
      });
    }

    if (nextEl) {
      nextEl.addEventListener("click", () => {
        const total = Math.max(1, chunk(filterByActiveTags(basePublished), pageSize).length);
        if (pageIndex >= total - 1) return;
        pageIndex += 1;
        render(true);
      });
    }

    if (pageListEl) {
      pageListEl.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-paper-page]");
        if (!btn) return;
        const nextPage = Number(btn.dataset.paperPage);
        if (!Number.isFinite(nextPage) || nextPage === pageIndex) return;
        pageIndex = nextPage;
        render(true);
      });
    }

    filterRenderers.push(() => {
      pageIndex = 0;
      render();
    });
    render();
  }

  function renderPaperCard(item) {
    return renderArchiveItem(item, "paper-summary");
  }

  function renderReviews() {
    const listEl = document.querySelector("[data-review-list]");
    if (!listEl) return;

    const prevEl = document.getElementById("reviewPrev");
    const nextEl = document.getElementById("reviewNext");
    const pageListEl = document.getElementById("reviewPageList");
    const pagerEl = pageListEl?.closest(".pager");
    const mode = listEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const basePublished = reviews.filter((item) => item.published !== false);
    const pageSize = parseNumber(listEl.dataset.pageSize, isPreview ? parseNumber(listEl.dataset.limit, 5) : 5);
    const limit = isPreview ? parseNumber(listEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const published = filterByActiveTags(basePublished);
      const scoped = published.slice(0, limit);
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      listEl.innerHTML = renderArchiveItems(pageItems, (item) => renderArchiveItem(item, "paper-review"));
      if (pageListEl) renderPageNumbers(total);
      if (pagerEl) pagerEl.hidden = scoped.length === 0;
      if (prevEl) prevEl.disabled = pageIndex === 0;
      if (nextEl) nextEl.disabled = pageIndex >= total - 1;
      if (shouldAlignList) alignReviewListToTop();
    };

    const renderPageNumbers = (total) => {
      pageListEl.innerHTML = Array.from({ length: total }, (_, index) => {
        const active = index === pageIndex ? " is-active" : "";
        return `
          <button class="pager-page-btn${active}" type="button" data-review-page="${index}" aria-label="Go to paper review page ${index + 1}" aria-current="${index === pageIndex ? "page" : "false"}">
            ${index + 1}
          </button>
        `;
      }).join("");
    };

    const alignReviewListToTop = () => {
      requestAnimationFrame(() => {
        const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
        const nextTop = listEl.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      });
    };

    if (prevEl) {
      prevEl.addEventListener("click", () => {
        if (pageIndex === 0) return;
        pageIndex -= 1;
        render(true);
      });
    }

    if (nextEl) {
      nextEl.addEventListener("click", () => {
        const total = Math.max(1, chunk(filterByActiveTags(basePublished), pageSize).length);
        if (pageIndex >= total - 1) return;
        pageIndex += 1;
        render(true);
      });
    }

    if (pageListEl) {
      pageListEl.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-review-page]");
        if (!btn) return;
        const nextPage = Number(btn.dataset.reviewPage);
        if (!Number.isFinite(nextPage) || nextPage === pageIndex) return;
        pageIndex = nextPage;
        render(true);
      });
    }

    filterRenderers.push(() => {
      pageIndex = 0;
      render();
    });
    render();
  }

  function renderStudy() {
    const listEl = document.querySelector("[data-study-list]");
    if (!listEl) return;

    const prevEl = document.getElementById("studyPrev");
    const nextEl = document.getElementById("studyNext");
    const pageListEl = document.getElementById("studyPageList");
    const pagerEl = pageListEl?.closest(".pager");
    const mode = listEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const basePublished = studies.filter((item) => item.published !== false);
    const pageSize = parseNumber(listEl.dataset.pageSize, isPreview ? parseNumber(listEl.dataset.limit, 5) : 5);
    const limit = isPreview ? parseNumber(listEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const published = filterByActiveTags(basePublished);
      const scoped = published.slice(0, limit);
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      listEl.innerHTML = renderArchiveItems(pageItems, renderStudyCard);
      if (pageListEl) renderPageNumbers(total);
      if (pagerEl) pagerEl.hidden = scoped.length === 0;
      if (prevEl) prevEl.disabled = pageIndex === 0;
      if (nextEl) nextEl.disabled = pageIndex >= total - 1;
      if (shouldAlignList) alignStudyListToTop();
    };

    const renderPageNumbers = (total) => {
      pageListEl.innerHTML = Array.from({ length: total }, (_, index) => {
        const active = index === pageIndex ? " is-active" : "";
        return `
          <button class="pager-page-btn${active}" type="button" data-study-page="${index}" aria-label="Go to study page ${index + 1}" aria-current="${index === pageIndex ? "page" : "false"}">
            ${index + 1}
          </button>
        `;
      }).join("");
    };

    const alignStudyListToTop = () => {
      requestAnimationFrame(() => {
        const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
        const nextTop = listEl.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      });
    };

    if (prevEl) {
      prevEl.addEventListener("click", () => {
        if (pageIndex === 0) return;
        pageIndex -= 1;
        render(true);
      });
    }

    if (nextEl) {
      nextEl.addEventListener("click", () => {
        const total = Math.max(1, chunk(filterByActiveTags(basePublished), pageSize).length);
        if (pageIndex >= total - 1) return;
        pageIndex += 1;
        render(true);
      });
    }

    if (pageListEl) {
      pageListEl.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-study-page]");
        if (!btn) return;
        const nextPage = Number(btn.dataset.studyPage);
        if (!Number.isFinite(nextPage) || nextPage === pageIndex) return;
        pageIndex = nextPage;
        render(true);
      });
    }

    filterRenderers.push(() => {
      pageIndex = 0;
      render();
    });
    render();
  }

  function renderStudyCard(item) {
    return renderArchiveItem(item, "study");
  }

  function renderProjects() {
    const gridEl = document.querySelector("[data-work-list]");
    if (!gridEl) return;

    const prevEl = document.getElementById("projectPrev");
    const nextEl = document.getElementById("projectNext");
    const pageListEl = document.getElementById("projectPageList");
    const pagerEl = pageListEl?.closest(".pager");
    const mode = gridEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const basePublished = projects.filter((item) => item.published !== false);
    const pageSize = parseNumber(gridEl.dataset.pageSize, isPreview ? parseNumber(gridEl.dataset.limit, 4) : 5);
    const limit = isPreview ? parseNumber(gridEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const published = filterByActiveTags(basePublished);
      const scoped = published.slice(0, limit);
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      gridEl.innerHTML = renderArchiveItems(pageItems, renderProjectCard);
      if (pageListEl) renderPageNumbers(total);
      if (pagerEl) pagerEl.hidden = scoped.length === 0;
      if (prevEl) prevEl.disabled = pageIndex === 0;
      if (nextEl) nextEl.disabled = pageIndex >= total - 1;
      if (shouldAlignList) alignProjectListToTop();
    };

    const renderPageNumbers = (total) => {
      pageListEl.innerHTML = Array.from({ length: total }, (_, index) => {
        const active = index === pageIndex ? " is-active" : "";
        return `
          <button class="pager-page-btn${active}" type="button" data-project-page="${index}" aria-label="Go to project page ${index + 1}" aria-current="${index === pageIndex ? "page" : "false"}">
            ${index + 1}
          </button>
        `;
      }).join("");
    };

    const alignProjectListToTop = () => {
      requestAnimationFrame(() => {
        const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
        const nextTop = gridEl.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      });
    };

    if (prevEl) {
      prevEl.addEventListener("click", () => {
        if (pageIndex === 0) return;
        pageIndex -= 1;
        render(true);
      });
    }

    if (nextEl) {
      nextEl.addEventListener("click", () => {
        const total = Math.max(1, chunk(filterByActiveTags(basePublished), pageSize).length);
        if (pageIndex >= total - 1) return;
        pageIndex += 1;
        render(true);
      });
    }

    if (pageListEl) {
      pageListEl.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-project-page]");
        if (!btn) return;
        const nextPage = Number(btn.dataset.projectPage);
        if (!Number.isFinite(nextPage) || nextPage === pageIndex) return;
        pageIndex = nextPage;
        render(true);
      });
    }

    filterRenderers.push(() => {
      pageIndex = 0;
      render();
    });
    render();
  }

  function renderProjectCard(item) {
    return renderArchiveItem(item, "project");
  }

  function renderArchiveItem(item, type) {
    const title = safeText(item.title);
    const desc = safeText(item.desc);
    const date = safeText(formatDate(item.date));
    const href = safeAttr(item.href || "#");
    const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
    const titlePrefixes = {
      project: "[프로젝트] ",
      study: "[스터디] ",
      "paper-review": "[논문리뷰] ",
      "paper-summary": "[논문요약] ",
    };
    const titlePrefix = titlePrefixes[type] || "";
    const sectionHash = {
      project: "#work",
      study: "#study",
      "paper-review": "#paper-reviews",
      "paper-summary": "#paper-summary",
    }[type] || "#work";
    const tagsMarkup = tags.length
      ? `<p class="archive__item-tags"><i class="fas fa-fw fa-tags" aria-hidden="true"></i><span class="archive__tags-label">Tags:</span>${tags.map((tag) => {
        const active = activeTags.some((selected) => selected.toLocaleLowerCase() === String(tag).toLocaleLowerCase());
        return `<button class="archive__tag${active ? " is-active" : ""}" type="button" data-filter-tag="${safeAttr(tag)}" data-filter-hash="${sectionHash}" aria-pressed="${active}" aria-label="${safeAttr(tag)} 태그 ${active ? "해제" : "선택"}">${safeText(tag)}</button>`;
      }).join("")}</p>`
      : "";

    return `
      <article class="archive__item archive__item--${safeAttr(type)}">
        <h2 class="archive__item-title no_toc"><a href="${href}">${titlePrefix}${title}</a></h2>
        ${date ? `<p class="page__meta"><i class="fas fa-fw fa-calendar-alt" aria-hidden="true"></i>${date}</p>` : ``}
        ${desc ? `<p class="archive__item-excerpt">${desc}</p>` : ``}
        ${tagsMarkup}
      </article>
    `;
  }

  function setupSidebarCounts() {
    const counts = {
      projects: projects.filter((item) => item.published !== false).length,
      study: studies.filter((item) => item.published !== false).length,
      reviews: reviews.filter((item) => item.published !== false).length,
      summaries: papers.filter((item) => item.published !== false).length,
    };

    Object.entries(counts).forEach(([key, count]) => {
      document.querySelectorAll(`[data-sidebar-count="${key}"]`).forEach((element) => {
        element.textContent = `(${count})`;
      });
    });
  }

  function updateTagUrl(hash = window.location.hash || "#work") {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("tag");
    activeTags.forEach((tag) => nextUrl.searchParams.append("tag", tag));
    nextUrl.hash = hash;
    history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  function refreshTagFilters() {
    filterRenderers.forEach((render) => render());
    renderActiveTagFilters();
  }

  function renderActiveTagFilters() {
    document.querySelectorAll(".active-tag-filter").forEach((element) => element.remove());
    if (!activeTags.length) return;

    const view = window.location.hash || "#work";
    const section = document.querySelector(view) || document.querySelector('[data-home-section="projects"]');
    const header = section?.querySelector(".home-section-head");
    if (!header) return;

    const filter = document.createElement("div");
    filter.className = "active-tag-filter";
    filter.setAttribute("aria-label", "선택된 태그 필터");
    filter.innerHTML = `
      <span class="active-tag-filter__label">선택된 태그</span>
      ${activeTags.map((tag) => `<button class="active-tag-filter__chip" type="button" data-remove-tag="${safeAttr(tag)}" aria-label="${safeAttr(tag)} 태그 해제">#${safeText(tag)} <span aria-hidden="true">&times;</span></button>`).join("")}
      <button class="active-tag-filter__clear-all" type="button" data-clear-tags>전체 해제</button>
    `;
    header.insertAdjacentElement("afterend", filter);
  }

  function setupTagControls() {
    document.addEventListener("click", (event) => {
      const tagButton = event.target.closest("[data-filter-tag]");
      const removeButton = event.target.closest("[data-remove-tag]");
      const clearButton = event.target.closest("[data-clear-tags]");
      if (!tagButton && !removeButton && !clearButton) return;

      event.preventDefault();
      event.stopPropagation();

      if (tagButton) {
        const tag = tagButton.dataset.filterTag?.trim();
        if (!tag) return;
        const index = activeTags.findIndex((selected) => selected.toLocaleLowerCase() === tag.toLocaleLowerCase());
        if (index >= 0) activeTags.splice(index, 1);
        else activeTags.push(tag);
        updateTagUrl(tagButton.dataset.filterHash || window.location.hash);
      } else if (removeButton) {
        const tag = removeButton.dataset.removeTag?.trim();
        activeTags = activeTags.filter((selected) => selected.toLocaleLowerCase() !== tag?.toLocaleLowerCase());
        updateTagUrl();
      } else {
        activeTags = [];
        updateTagUrl();
      }

      refreshTagFilters();
    });
  }

  function setupHomeViewSwitch() {
    const buttons = Array.from(document.querySelectorAll("[data-home-view]"));
    const sections = Array.from(document.querySelectorAll("[data-home-section]"));
    if (!buttons.length || !sections.length) return;

    const viewFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#study") return "study";
      if (hash === "#papers" || hash === "#paper-reviews") return "reviews";
      if (hash === "#summaries" || hash === "#paper-summary") return "summaries";
      return "projects";
    };

    const hashForView = (view) => view === "projects"
      ? "#work"
      : (view === "reviews"
        ? "#paper-reviews"
        : (view === "summaries" ? "#paper-summary" : "#study"));

    const setView = (view, shouldScroll = false, shouldUpdateHash = false) => {
      const nextView = sections.some((section) => section.dataset.homeSection === view) ? view : "projects";
      buttons.forEach((button) => {
        const active = button.dataset.homeView === nextView;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      sections.forEach((section) => {
        section.hidden = section.dataset.homeSection !== nextView;
      });

      if (shouldUpdateHash) {
        const nextHash = hashForView(nextView);
        if (window.location.hash !== nextHash) {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
        }
      }

      if (shouldScroll) {
        const target = document.querySelector(`[data-home-section="${nextView}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const nextView = button.dataset.homeView || "projects";
        if (activeTags.length) {
          activeTags = [];
          updateTagUrl(hashForView(nextView));
          refreshTagFilters();
        }
        setView(nextView, true, true);
      });
    });

    window.addEventListener("hashchange", () => {
      setView(viewFromHash(), false);
    });

    setView(viewFromHash());
  }
})();
