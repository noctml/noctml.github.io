(() => {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  try { window.localStorage.removeItem("theme"); } catch {
    // Storage can be unavailable for local previews.
  }
})();

(() => {
  const list = document.getElementById("sectionBookmarkList");
  const current = document.getElementById("currentSectionLabel");
  const topbar = document.querySelector(".topbar");
  if (!list || !current) return;

  const sections = Array.from(document.querySelectorAll(".article > .section"))
    .map((section, index) => {
      const heading = section.querySelector("h2");
      if (!heading) return null;
      if (!heading.id) heading.id = `project-section-${index + 1}`;
      return {
        id: heading.id,
        label: heading.textContent.trim(),
        node: heading
      };
    })
    .filter(Boolean);

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
})();

(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (!lightbox || !lightboxImg) return;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const image = event.target.closest(".plot-grid img");
    if (!image) return;
    event.preventDefault();
    open(image.src, image.alt);
  });

  lightboxClose?.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();
