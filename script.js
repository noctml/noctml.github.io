(() => {
  const root = document.documentElement;

  // Dates
  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  if (year) year.textContent = new Date().getFullYear();
  if (updated) updated.textContent = new Date().toISOString().slice(0, 10);

  // Theme toggle (default: light)
  // - light(기본): 아무 속성 없음
  // - dark: data-theme="dark"
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
