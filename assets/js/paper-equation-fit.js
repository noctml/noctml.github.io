(() => {
  const body = document.body;
  if (!body?.classList.contains("paper-article-page")) return;

  let frameId = 0;

  const resetEquation = (display, katex) => {
    display.style.removeProperty("height");
    display.removeAttribute("data-equation-fit");
    katex.style.removeProperty("transform");
    katex.style.removeProperty("transform-origin");
  };

  const fitEquation = (display) => {
    const katex = display.querySelector(":scope > .katex");
    if (!katex) return;

    resetEquation(display, katex);
    if (display.closest("[hidden]") || display.getClientRects().length === 0) return;

    const availableWidth = display.clientWidth;
    const naturalWidth = katex.scrollWidth;
    if (!availableWidth || naturalWidth <= availableWidth + 1) return;

    const naturalHeight = katex.offsetHeight;
    const scale = Math.min(1, (availableWidth - 2) / naturalWidth);

    katex.style.transformOrigin = "top left";
    katex.style.transform = `scale(${scale})`;
    display.style.height = `${Math.ceil(naturalHeight * scale)}px`;
    display.dataset.equationFit = scale.toFixed(4);
  };

  const fitVisibleEquations = () => {
    frameId = 0;
    document
      .querySelectorAll("figure.equation .katex-display")
      .forEach(fitEquation);
  };

  const scheduleFit = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(fitVisibleEquations);
  };

  document.addEventListener("DOMContentLoaded", scheduleFit, { once: true });
  window.addEventListener("load", scheduleFit, { once: true });
  window.addEventListener("resize", scheduleFit, { passive: true });
  document.addEventListener("click", (event) => {
    if (event.target.closest("#langBtn, #deepDiveMoreBtn")) {
      requestAnimationFrame(scheduleFit);
    }
  });

  if (document.fonts?.ready) document.fonts.ready.then(scheduleFit);

  const article = document.querySelector("#main-content");
  if (article && "ResizeObserver" in window) {
    new ResizeObserver(scheduleFit).observe(article);
  }
})();
