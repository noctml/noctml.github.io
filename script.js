(() => {
  const root = document.documentElement;

  // Light-only theme.
  root.removeAttribute("data-theme");
  try { localStorage.removeItem("theme"); } catch {
    // Storage can be unavailable for local previews.
  }

  // Visit counter. Requires the Cloudflare Worker endpoint in index.html:
  // <meta name="visit-counter-endpoint" content="https://...workers.dev" />
  const visitToday = document.getElementById("visitToday");
  const visitYesterday = document.getElementById("visitYesterday");
  const endpointMeta = document.querySelector('meta[name="visit-counter-endpoint"]');
  const endpoint = endpointMeta?.content?.trim();

  const setVisitCounts = (today, yesterday) => {
    const formatter = new Intl.NumberFormat("ko-KR");
    if (visitToday) visitToday.textContent = Number.isFinite(today) ? formatter.format(today) : "--";
    if (visitYesterday) visitYesterday.textContent = Number.isFinite(yesterday) ? formatter.format(yesterday) : "--";
  };

  const visitUrl = (() => {
    if (!endpoint) return "";
    const clean = endpoint.replace(/\/+$/, "");
    return clean.endsWith("/visit") ? clean : `${clean}/visit`;
  })();

  if (visitToday && visitYesterday) {
    if (!visitUrl) {
      setVisitCounts(NaN, NaN);
    } else {
      fetch(visitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: window.location.pathname,
          referrer: document.referrer || ""
        }),
        cache: "no-store"
      })
        .then((response) => {
          if (!response.ok) throw new Error(`visit counter ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setVisitCounts(Number(data.today), Number(data.yesterday));
        })
        .catch(() => {
          setVisitCounts(NaN, NaN);
        });
    }
  }
})();
