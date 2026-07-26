(() => {
  const tabs = Array.from(document.querySelectorAll("[data-track-filter]"));
  const sections = Array.from(document.querySelectorAll("[data-track]"));
  const validTracks = new Set(sections.map((section) => section.dataset.track));
  const moduleTabs = Array.from(document.querySelectorAll("[data-module-filter]"));
  const modulePanels = Array.from(document.querySelectorAll("[data-official-module]"));
  const trackNavigation = document.querySelector(".track-navigation");
  const previousModuleButton = document.querySelector("[data-module-previous]");
  const nextModuleButton = document.querySelector("[data-module-next]");
  const previousModuleLabel = document.querySelector("[data-module-previous-label]");
  const nextModuleLabel = document.querySelector("[data-module-next-label]");
  const officialTroubleshooting = document.querySelector("[data-official-troubleshooting]");
  const officialIssues = Array.from(document.querySelectorAll("[data-official-issue]"));
  const moduleOrder = modulePanels.map((panel) => panel.dataset.officialModule);

  function moduleLabel(module) {
    const tab = moduleTabs.find((item) => item.dataset.moduleFilter === module);
    if (!tab) return "";
    const number = tab.querySelector("span")?.textContent.trim() || module;
    const name = Array.from(tab.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join(" ");
    return `${number} ${name}`.trim();
  }

  function updateModulePagination(activeModule) {
    const activeIndex = moduleOrder.indexOf(activeModule);
    const previousModule = moduleOrder[activeIndex - 1];
    const nextModule = moduleOrder[activeIndex + 1];

    if (previousModuleButton) {
      previousModuleButton.hidden = !previousModule;
      previousModuleButton.dataset.moduleTarget = previousModule || "";
    }
    if (previousModuleLabel) {
      previousModuleLabel.textContent = previousModule ? moduleLabel(previousModule) : "";
    }

    if (nextModuleButton) {
      nextModuleButton.hidden = !nextModule;
      nextModuleButton.dataset.moduleTarget = nextModule || "";
    }
    if (nextModuleLabel) {
      nextModuleLabel.textContent = nextModule ? moduleLabel(nextModule) : "";
    }
  }

  function updateOfficialIssues(activeModule) {
    let visibleIssueCount = 0;

    officialIssues.forEach((issue) => {
      const isVisible = issue.dataset.officialIssue
        .split(",")
        .map((module) => module.trim())
        .includes(activeModule);
      issue.hidden = !isVisible;
      if (isVisible) visibleIssueCount += 1;
    });

    if (officialTroubleshooting) {
      officialTroubleshooting.hidden = visibleIssueCount === 0;
    }
  }

  function revealActiveTab(tab, smooth = false) {
    const container = tab?.parentElement;
    if (!container || container.scrollWidth <= container.clientWidth) return;
    const left = tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(0, left), behavior: smooth ? "smooth" : "auto" });
  }

  function setTrack(track, updateHash = true) {
    const activeTrack = validTracks.has(track) ? track : "all";
    let activeTab = null;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.trackFilter === activeTrack;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
      if (isActive) activeTab = tab;
    });

    sections.forEach((section) => {
      const isVisible = activeTrack === "all" || section.dataset.track === activeTrack;
      section.hidden = !isVisible;
      if (!isVisible) {
        section.querySelectorAll("video").forEach((video) => video.pause());
      }
    });

    trackNavigation?.classList.toggle("is-module-open", activeTrack === "official");

    if (updateHash) {
      const nextHash = activeTrack === "all" ? "" : `#${activeTrack}`;
      history.replaceState(null, "", `${location.pathname}${location.search}${nextHash}`);
    }

    requestAnimationFrame(() => revealActiveTab(activeTab, updateHash));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setTrack(tab.dataset.trackFilter);
      document.querySelector(".track-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function setModule(module, shouldScroll = false) {
    const activeModule = modulePanels.some((panel) => panel.dataset.officialModule === module)
      ? module
      : "001";
    let activeTab = null;

    moduleTabs.forEach((tab) => {
      const isActive = tab.dataset.moduleFilter === activeModule;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
      if (isActive) activeTab = tab;
    });

    modulePanels.forEach((panel) => {
      const isVisible = panel.dataset.officialModule === activeModule;
      panel.hidden = !isVisible;
      if (!isVisible) {
        panel.querySelectorAll("video").forEach((video) => video.pause());
      }
    });

    updateModulePagination(activeModule);
    updateOfficialIssues(activeModule);

    requestAnimationFrame(() => {
      revealActiveTab(activeTab, shouldScroll);
      if (shouldScroll) {
        document.querySelector(".module-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  moduleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setTrack("official");
      setModule(tab.dataset.moduleFilter, true);
    });
  });

  [previousModuleButton, nextModuleButton].forEach((button) => {
    button?.addEventListener("click", () => {
      const targetModule = button.dataset.moduleTarget;
      if (!targetModule) return;
      setTrack("official");
      setModule(targetModule, true);
    });
  });

  window.addEventListener("hashchange", () => {
    setTrack(location.hash.slice(1), false);
  });

  setModule("001");
  setTrack(location.hash.slice(1), false);
})();
