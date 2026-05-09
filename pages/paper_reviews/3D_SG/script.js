(() => {
  const root = document.documentElement;

  // Dates
  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  if (year) year.textContent = new Date().getFullYear();
  if (updated) updated.textContent = new Date().toISOString().slice(0, 10);

  // Theme toggle (default: light)
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
    if (currentTheme === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", currentTheme);
    }

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



(function setupLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose"); // ✅ 추가
  if (!lb || !lbImg) return;

  function open(src) {
    lbImg.src = src;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  // ✅ X 버튼으로 닫기
  lbClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // 배경 클릭 닫기 이벤트로 번지는 거 방지
    close();
  });

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".post-body img");
    if (!img) return;
    e.preventDefault();
    open(img.src);
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
