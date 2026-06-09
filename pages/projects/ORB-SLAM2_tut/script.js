(() => {
  const root = document.documentElement;

  // Dates
  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  if (year) year.textContent = new Date().getFullYear();
  if (updated) updated.textContent = new Date().toISOString().slice(0, 10);

  // Light-only theme.
  root.removeAttribute("data-theme");
  try { localStorage.removeItem("theme"); } catch {
    // Storage can be unavailable for local previews.
  }

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
