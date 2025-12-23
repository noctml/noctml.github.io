(() => {
  const root = document.documentElement;

  // Footer dates
  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  if (year) year.textContent = new Date().getFullYear();
  if (updated) updated.textContent = new Date().toISOString().slice(0, 10);

  // Theme toggle (minimal)
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");

  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  const syncIcon = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (themeIcon) themeIcon.textContent = isLight ? "☀" : "☾";
  };
  syncIcon();

  themeBtn?.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme");
    const next = cur === "light" ? "" : "light";

    if (next) {
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "");
    }
    syncIcon();
  });
})();
