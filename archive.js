(() => {
  const data = window.SITE_DATA || {};
  const papers = sortByDate(data.paperReviews || []);
  const studies = sortByDate(data.study || data.studies || []);
  const projects = sortByDate(data.projects || []);
  const configuredPaperGroups = data.paperGroups || [];

  const navArea = document.body?.dataset?.area || "";
  document.querySelectorAll("[data-nav-area]").forEach((link) => {
    if (link.dataset.navArea === navArea) link.classList.add("is-active");
  });

  renderPapers();
  renderStudy();
  renderProjects();
  setupHomeViewSwitch();

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
    return String(value).trim().replace(/-/g, ".");
  }

  function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function uniquePaperGroups(visiblePapers) {
    const discovered = Array.from(new Set(visiblePapers.map((item) => item.group).filter(Boolean)));
    if (!configuredPaperGroups.length) return discovered;
    const configured = configuredPaperGroups.filter((group) => discovered.includes(group));
    const extras = discovered.filter((group) => !configured.includes(group));
    return [...configured, ...extras];
  }

  function renderPapers() {
    const listEl = document.querySelector("[data-paper-list]");
    if (!listEl) return;

    const groupEl = document.getElementById("paperGroupList");
    const prevEl = document.getElementById("paperPrev");
    const nextEl = document.getElementById("paperNext");
    const infoEl = document.getElementById("paperPageInfo");
    const pageListEl = document.getElementById("paperPageList");
    const mode = listEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const published = papers.filter((item) => item.published !== false);
    const pageSize = parseNumber(listEl.dataset.pageSize, isPreview ? parseNumber(listEl.dataset.limit, 5) : 12);
    const limit = isPreview ? parseNumber(listEl.dataset.limit, pageSize) : Infinity;

    let activeGroup = "All";
    let pageIndex = 0;

    const paperGroupCount = (group) => {
      if (group === "All") return published.length;
      return published.filter((item) => item.group === group).length;
    };

    const renderGroups = () => {
      if (!groupEl || isPreview) return;
      const groups = ["All", ...uniquePaperGroups(published)];
      groupEl.innerHTML = groups.map((group) => {
        const active = group === activeGroup ? " is-active" : "";
        return `
          <button class="paper-group-btn${active}" type="button" data-paper-group="${safeAttr(group)}" aria-pressed="${group === activeGroup}">
            <span>${safeText(group)}</span>
            <span class="paper-group-count">${paperGroupCount(group)}</span>
          </button>
        `;
      }).join("");
    };

    const render = (shouldAlignList = false) => {
      const filtered = activeGroup === "All"
        ? published
        : published.filter((item) => item.group === activeGroup);
      const scoped = isPreview ? filtered.slice(0, limit) : filtered;
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      renderGroups();
      listEl.innerHTML = pageItems.map(renderPaperCard).join("");

      if (infoEl) infoEl.textContent = `${pageIndex + 1} / ${total}`;
      if (pageListEl) renderPageNumbers(total);
      if (prevEl) prevEl.disabled = pageIndex === 0;
      if (nextEl) nextEl.disabled = pageIndex >= total - 1;
      if (shouldAlignList) alignPaperListToTop();
    };

    const renderPageNumbers = (total) => {
      pageListEl.innerHTML = Array.from({ length: total }, (_, index) => {
        const active = index === pageIndex ? " is-active" : "";
        return `
          <button class="pager-page-btn${active}" type="button" data-paper-page="${index}" aria-label="Go to paper review page ${index + 1}" aria-current="${index === pageIndex ? "page" : "false"}">
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

    if (groupEl && !isPreview) {
      groupEl.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-paper-group]");
        if (!btn) return;
        activeGroup = btn.dataset.paperGroup || "All";
        pageIndex = 0;
        render(true);
      });
    }

    if (prevEl) {
      prevEl.addEventListener("click", () => {
        if (pageIndex === 0) return;
        pageIndex -= 1;
        render(true);
      });
    }

    if (nextEl) {
      nextEl.addEventListener("click", () => {
        const filtered = activeGroup === "All"
          ? published
          : published.filter((item) => item.group === activeGroup);
        const total = Math.max(1, chunk(filtered, pageSize).length);
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

    render();
  }

  function renderPaperCard(item) {
    const title = safeText(item.title);
    const titleAttr = safeAttr(item.title);
    const desc = safeText(item.desc);
    const date = safeText(formatDate(item.date));
    const thumb = safeAttr(item.thumb || "");
    const href = safeAttr(item.href || "#");

    return `
      <a class="paper-card" href="${href}">
        <div class="paper-thumb">
          ${thumb ? `<img src="${thumb}" alt="${titleAttr} thumbnail" loading="lazy" />` : ``}
        </div>
        <div class="paper-body">
          <div class="row-title">${title}</div>
          <div class="row-sub muted">${desc}</div>
          ${date ? `<div class="paper-date">${date}</div>` : ``}
        </div>
      </a>
    `;
  }

  function renderStudy() {
    const listEl = document.querySelector("[data-study-list]");
    if (!listEl) return;

    const prevEl = document.getElementById("studyPrev");
    const nextEl = document.getElementById("studyNext");
    const pageListEl = document.getElementById("studyPageList");
    const mode = listEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const published = studies.filter((item) => item.published !== false);
    const pageSize = parseNumber(listEl.dataset.pageSize, isPreview ? parseNumber(listEl.dataset.limit, 5) : 5);
    const limit = isPreview ? parseNumber(listEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const scoped = published.slice(0, limit);
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      listEl.innerHTML = pageItems.map(renderStudyCard).join("");
      if (pageListEl) renderPageNumbers(total);
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
        const total = Math.max(1, chunk(published, pageSize).length);
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

    render();
  }

  function renderStudyCard(item) {
    const title = safeText(item.title);
    const titleAttr = safeAttr(item.title);
    const desc = safeText(item.desc);
    const date = safeText(formatDate(item.date));
    const thumb = safeAttr(item.thumb || "");
    const href = safeAttr(item.href || "#");

    return `
      <a class="paper-card" href="${href}">
        <div class="paper-thumb">
          ${thumb ? `<img src="${thumb}" alt="${titleAttr} thumbnail" loading="lazy" />` : ``}
        </div>
        <div class="paper-body">
          <div class="row-title">${title}</div>
          <div class="row-sub muted">${desc}</div>
          ${date ? `<div class="paper-date">${date}</div>` : ``}
        </div>
      </a>
    `;
  }

  function renderProjects() {
    const gridEl = document.querySelector("[data-work-list]");
    if (!gridEl) return;

    const prevEl = document.getElementById("projectPrev");
    const nextEl = document.getElementById("projectNext");
    const pageListEl = document.getElementById("projectPageList");
    const mode = gridEl.dataset.mode || "archive";
    const isPreview = mode === "preview";
    const published = projects.filter((item) => item.published !== false);
    const pageSize = parseNumber(gridEl.dataset.pageSize, isPreview ? parseNumber(gridEl.dataset.limit, 4) : 5);
    const limit = isPreview ? parseNumber(gridEl.dataset.limit, pageSize) : Infinity;

    let pageIndex = 0;

    const render = (shouldAlignList = false) => {
      const scoped = published.slice(0, limit);
      const pages = chunk(scoped, pageSize);
      const total = Math.max(1, pages.length);
      if (pageIndex >= total) pageIndex = 0;
      const pageItems = isPreview ? scoped : (pages[pageIndex] || []);

      gridEl.innerHTML = pageItems.map(renderProjectCard).join("");
      if (pageListEl) renderPageNumbers(total);
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
        const total = Math.max(1, chunk(published, pageSize).length);
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

    render();
  }

  function renderProjectCard(item) {
    const title = safeText(item.title);
    const desc = safeText(item.desc);
    const date = safeText(formatDate(item.date));
    const thumb = safeAttr(item.thumb || "");
    const href = safeAttr(item.href || "#");

    return `
      <a class="project-card" href="${href}">
        <div class="project-thumb">
          ${thumb ? `<img src="${thumb}" alt="${safeAttr(item.title)} thumbnail" loading="lazy" />` : ``}
        </div>
        <div class="project-body">
          <div class="row-title">${title}</div>
          <div class="row-sub muted">${desc}</div>
          ${date ? `<div class="project-date">${date}</div>` : ``}
        </div>
      </a>
    `;
  }

  function setupHomeViewSwitch() {
    const buttons = Array.from(document.querySelectorAll("[data-home-view]"));
    const sections = Array.from(document.querySelectorAll("[data-home-section]"));
    if (!buttons.length || !sections.length) return;

    const setView = (view, shouldScroll = false) => {
      const nextView = sections.some((section) => section.dataset.homeSection === view) ? view : "papers";
      buttons.forEach((button) => {
        const active = button.dataset.homeView === nextView;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      sections.forEach((section) => {
        section.hidden = section.dataset.homeSection !== nextView;
      });

      if (shouldScroll) {
        const target = document.querySelector(`[data-home-section="${nextView}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => {
        setView(button.dataset.homeView || "papers", true);
      });
    });

    const hash = window.location.hash;
    const initial = hash === "#study"
      ? "study"
      : (hash === "#papers" || hash === "#paper-reviews" ? "papers" : "projects");
    setView(initial);
  }
})();
