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

  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");

  const syncIcon = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (themeIcon) themeIcon.textContent = isDark ? "☾" : "☀";
  };
  syncIcon();

  themeBtn?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    syncIcon();
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
