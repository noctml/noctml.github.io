(() => {
  const root = document.documentElement;

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
