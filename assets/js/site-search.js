(function () {
  "use strict";

  const MAX_RESULTS = 50;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("ko-KR");
  }

  function scoreItem(item, terms) {
    const title = normalize(item.title);
    const description = normalize(item.description);
    const tags = normalize(item.tags);
    const content = normalize(item.excerpt);
    let score = 0;

    for (const term of terms) {
      if (!content.includes(term) && !title.includes(term) && !tags.includes(term)) return -1;
      if (title === term) score += 40;
      else if (title.includes(term)) score += 18;
      if (tags.includes(term)) score += 12;
      if (description.includes(term)) score += 7;
      if (content.includes(term)) score += 2;
    }

    return score;
  }

  function renderResults(results, container) {
    if (!results.length) {
      container.innerHTML = '<p class="results__found">검색 결과가 없습니다.</p>';
      return;
    }

    const items = results.map(({ item }) => `
      <div class="list__item">
        <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
          <h2 class="archive__item-title no_toc" itemprop="headline">
            <a href="${escapeHtml(item.url)}" rel="permalink">${escapeHtml(item.title)}</a>
          </h2>
          ${item.description ? `<p class="archive__item-excerpt" itemprop="description">${escapeHtml(item.description)}</p>` : ""}
        </article>
      </div>
    `).join("");

    container.innerHTML = `<p class="results__found">${results.length}개의 결과</p>${items}`;
  }

  function initializeSearch() {
    const input = document.getElementById("search");
    const resultsContainer = document.getElementById("results");
    const store = Array.isArray(window.SITE_SEARCH_INDEX) ? window.SITE_SEARCH_INDEX : [];
    if (!input || !resultsContainer) return;

    const search = () => {
      const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
      if (!terms.length) {
        resultsContainer.replaceChildren();
        return;
      }

      const results = store
        .map((item) => ({ item, score: scoreItem(item, terms) }))
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "ko"))
        .slice(0, MAX_RESULTS);
      renderResults(results, resultsContainer);
    };

    input.addEventListener("input", search);
    input.addEventListener("search", search);
    if (input.value) search();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSearch, { once: true });
  } else {
    initializeSearch();
  }
})();
