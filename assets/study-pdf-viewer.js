(() => {
  const viewers = Array.from(document.querySelectorAll(".pdf-viewer[data-pages]"));
  if (!viewers.length) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  const syncViewerHeight = () => {
    viewers.forEach((viewer) => {
      if (!mobileQuery.matches) {
        viewer.style.removeProperty("--pdf-mobile-height");
        return;
      }

      const pageCount = Number.parseInt(viewer.dataset.pages || "", 10);
      if (!Number.isFinite(pageCount) || pageCount < 1) return;

      const contentWidth = Math.max(1, viewer.clientWidth - 2);
      const pageHeight = contentWidth * 9 / 16;
      const toolbarHeight = 56;
      const pageGap = 2;
      const bottomPadding = 24;
      const viewerHeight = Math.ceil(
        toolbarHeight +
        pageCount * pageHeight +
        (pageCount - 1) * pageGap +
        bottomPadding
      );

      viewer.style.setProperty("--pdf-mobile-height", `${viewerHeight}px`);
    });
  };

  syncViewerHeight();
  window.addEventListener("resize", syncViewerHeight, { passive: true });
  mobileQuery.addEventListener?.("change", syncViewerHeight);
})();
