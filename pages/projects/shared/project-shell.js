(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const list = document.getElementById("sectionBookmarkList");
    const current = document.getElementById("currentSectionLabel");
    const scope = document.querySelector(".panel") || document.querySelector("main");
    const topbar = document.querySelector(".topbar");
    if (!list || !current || !scope) return;

    const isInsideClosedOrNestedDetails = (node) => Boolean(node.closest("details"));
    const labelText = (node) => node.textContent.replace(/\s+/g, " ").trim();
    const body = scope.querySelector(".post-body");

    if (body) {
      body.querySelectorAll(":scope > ul.bulleted-list, :scope > ul.toggle, :scope > div[style*='display:contents'] > ul.bulleted-list, :scope > div[style*='display:contents'] > ul.toggle")
        .forEach((node) => node.classList.add("project-top-list"));

      body.querySelectorAll(".callout, .notion-callout").forEach((callout) => {
        const summary = callout.querySelector("summary");
        if (summary && labelText(summary) === "로그") {
          callout.classList.add("project-log-callout");
        }
      });
    }

    const candidates = [
      ...Array.from(scope.querySelectorAll(":scope > h1")),
      ...Array.from(scope.querySelectorAll(".post-body h2, .post-body h3")).filter((node) => !isInsideClosedOrNestedDetails(node)),
      ...Array.from(scope.querySelectorAll(".post-body blockquote")).filter((node) => !isInsideClosedOrNestedDetails(node))
    ];

    const seen = new Set();
    const sections = candidates
      .map((node, index) => {
        const label = labelText(node);
        if (!label || seen.has(label)) return null;
        seen.add(label);
        if (!node.id) node.id = `project-section-${index + 1}`;
        return { id: node.id, label, node };
      })
      .filter(Boolean)
      .slice(0, 18);

    if (!sections.length) return;

    list.innerHTML = "";

    const setActive = (active) => {
      sections.forEach((section) => {
        section.link?.classList.toggle("active", section === active);
      });
      current.textContent = active?.label || sections[0].label;
    };

    sections.forEach((section) => {
      const link = document.createElement("a");
      link.className = "bookmark-link";
      link.href = `#${section.id}`;
      link.textContent = section.label;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const topOffset = (topbar?.getBoundingClientRect().height || 0) + 22;
        const targetTop = section.node.getBoundingClientRect().top + window.pageYOffset - topOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        history.replaceState(null, "", `#${section.id}`);
        setActive(section);
      });
      section.link = link;
      list.appendChild(link);
    });

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const active = sections.find((section) => section.node === visible.target);
      if (active) setActive(active);
    }, {
      rootMargin: "-12% 0px -72% 0px",
      threshold: [0, 0.1, 0.35]
    });

    sections.forEach((section) => observer.observe(section.node));
    setActive(sections[0]);
  });
})();
