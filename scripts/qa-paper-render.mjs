#!/usr/bin/env node

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const repoBase = process.argv[2] || "http://127.0.0.1:8798";
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pagesRoot = path.resolve("pages/paper_reviews");
const pages = fs
  .readdirSync(pagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((pageName) => !pageName.startsWith("_"))
  .filter((pageName) => fs.existsSync(path.join(pagesRoot, pageName, "index.html")))
  .sort((a, b) => a.localeCompare(b));

const viewports = [
  { label: "desktop", width: 1280, height: 920 },
  { label: "mobile", width: 390, height: 920 }
];

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath
});

const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  for (const pageName of pages) {
    for (const lang of ["ko", "en"]) {
      await page.goto(`${repoBase}/pages/paper_reviews/${pageName}/index.html?qa=paper-render-${Date.now()}#main`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000
      });
      await page.waitForTimeout(500);
      await ensureLanguage(page, lang);
      await revealForQa(page);
      await page.waitForTimeout(150);
      results.push(await scanPage(page, pageName, lang, viewport.label));
    }
  }

  await context.close();
}

await browser.close();

const issues = results.filter((item) => item.issueCount > 0);

console.log(JSON.stringify({
  total: results.length,
  issueTotal: issues.length,
  issues: issues.map((item) => ({
    page: item.page,
    lang: item.lang,
    viewport: item.viewport,
    width: item.width,
    issueCount: item.issueCount,
    rawTex: item.rawTex,
    rawUnderscore: item.rawUnderscore,
    katexErrors: item.katexErrors,
    zeroWidthMathParts: item.zeroWidthMathParts,
    wideTables: item.wideTables,
    clippedCells: item.clippedCells,
    clippedEquations: item.clippedEquations,
    pageOverflow: item.pageOverflow
  })),
  tightCellNotes: results
    .filter((item) => item.tightCells.length > 0)
    .map((item) => ({
      page: item.page,
      lang: item.lang,
      viewport: item.viewport,
      count: item.tightCells.length,
      samples: item.tightCells.slice(0, 3)
    }))
}, null, 2));

async function ensureLanguage(page, lang) {
  await clearFocusOverlay(page);
  for (let i = 0; i < 3; i += 1) {
    const current = await page.evaluate(() => document.documentElement.lang || document.documentElement.dataset.pageLang || "ko");
    if (current === lang) return;
    const button = page.locator("#langBtn");
    if ((await button.count()) === 0) return;
    await button.click({ timeout: 5_000 });
    await page.waitForTimeout(250);
  }
}

async function revealForQa(page) {
  await clearFocusOverlay(page);
  const more = page.locator("#deepDiveMoreBtn, #deepDiveReveal").filter({ visible: true });
  if ((await more.count()) > 0) {
    await more.first().click({ timeout: 5_000 }).catch(() => {});
  }

  await page.evaluate(() => {
    document.querySelectorAll(".deep-dive-content").forEach((el) => {
      el.classList?.remove("is-collapsed");
    });
    document.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });
    document.querySelectorAll(".toggle-panel-body, .details-content").forEach((el) => {
      if (el instanceof HTMLElement) el.style.maxHeight = "none";
    });
  });
  await clearFocusOverlay(page);
}

async function clearFocusOverlay(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".supplement-focus-backdrop, .details-focus-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("supplement-focus-open", "details-focus-open");
    document.documentElement.classList.remove("supplement-focus-open", "details-focus-open");
  }).catch(() => {});
}

async function scanPage(page, pageName, lang, viewport) {
  return page.evaluate(
    ({ pageName, lang, viewport }) => {
      const norm = (value) => (value || "").replace(/\s+/g, " ").trim();
      const isVisible = (el) => {
        if (!el) return false;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const cleanText = (el) => {
        const clone = el.cloneNode(true);
        clone
          .querySelectorAll("script, style, annotation, semantics, .katex-mathml, code, pre")
          .forEach((node) => node.remove());
        return norm(clone.innerText || clone.textContent || "");
      };

      const root =
        document.querySelector(`[data-lang-panel="${lang}"]`) ||
        document.querySelector(".post-body") ||
        document.body;

      const visibleText = norm(
        [...root.querySelectorAll("p, li, td, th, figcaption, .equation-main, .inline-math, .notion-text-equation-token")]
          .filter((el) => isVisible(el) && !el.closest("script, style, annotation, .katex-mathml, code, pre"))
          .map((el) => cleanText(el))
          .join(" ")
      );

      const rawTex = (visibleText.match(/\\(?:frac|sum|begin|end|tag|left|right|mathbb|mathbf)|\$\$/g) || [])
        .slice(0, 8);

      const rawUnderscore = [...root.querySelectorAll(".inline-math, .math-token, .model-token")]
        .filter(isVisible)
        .filter((el) => !el.querySelector(".katex") && !el.classList.contains("katex-source-rendered"))
        .map((el) => cleanText(el))
        .filter((text) => /[A-Za-z0-9α-ωΑ-Ωπθτλξωŷĉ]\s*[_^]\s*[A-Za-z0-9{]/.test(text))
        .slice(0, 8);

      const katexErrors = [...root.querySelectorAll(".katex-error")]
        .filter(isVisible)
        .map((el) => norm(el.innerText || el.textContent || "").slice(0, 140));

      const nearestReadableBox = (el) =>
        el.closest(".summary-panel, .appendix-details, .post-body, .panel, .container") || root;

      const wideTables = [...root.querySelectorAll(".summary-table-wrap, table.summary-table, table.simple-table")]
        .filter(isVisible)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const box = nearestReadableBox(el);
          const boxRect = box.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            className: el.className || "",
            text: cleanText(el).slice(0, 140),
            width: Math.ceil(rect.width),
            right: Math.ceil(rect.right),
            boxWidth: Math.ceil(boxRect.width),
            boxRight: Math.ceil(boxRect.right),
            overflowBy: Math.ceil(rect.right - boxRect.right)
          };
        })
        .filter((item) => item.text && (item.width - item.boxWidth > 3 || item.overflowBy > 3))
        .slice(0, 12);

      const zeroWidthMathParts = [...root.querySelectorAll("figure.equation .katex-html :is(.mfrac, .sqrt, .mop.op-symbol.large-op)")]
        .filter((el) => el.closest("figure.equation") && isVisible(el.closest("figure.equation")))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            part: [...el.classList].join("."),
            text: norm(el.innerText || el.textContent || "").slice(0, 80),
            width: Number(rect.width.toFixed(2)),
            height: Number(rect.height.toFixed(2))
          };
        })
        .filter((item) => item.text && (item.width < 1 || item.height < 1))
        .slice(0, 12);

      const clippedCells = [...root.querySelectorAll("td, th")]
        .filter(isVisible)
        .map((cell) => {
          const style = getComputedStyle(cell);
          const clipped = /(hidden|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`);
          return {
            text: norm(cell.innerText || cell.textContent || "").slice(0, 140),
            scrollWidth: Math.ceil(cell.scrollWidth),
            clientWidth: Math.ceil(cell.clientWidth),
            scrollHeight: Math.ceil(cell.scrollHeight),
            clientHeight: Math.ceil(cell.clientHeight),
            overflow: `${style.overflow}/${style.overflowX}/${style.overflowY}`,
            clipped
          };
        })
        .filter((cell) => cell.text && cell.clipped && ((cell.scrollWidth - cell.clientWidth > 3) || (cell.scrollHeight - cell.clientHeight > 3)))
        .slice(0, 12);

      const tightCells = [...root.querySelectorAll("td, th")]
        .filter(isVisible)
        .map((cell) => ({
            text: norm(cell.innerText || cell.textContent || "").slice(0, 140),
          scrollWidth: Math.ceil(cell.scrollWidth),
          clientWidth: Math.ceil(cell.clientWidth),
          scrollHeight: Math.ceil(cell.scrollHeight),
          clientHeight: Math.ceil(cell.clientHeight)
        }))
        .filter((cell) => cell.text && ((cell.scrollWidth - cell.clientWidth > 8) || (cell.scrollHeight - cell.clientHeight > 8)))
        .slice(0, 12);

      const clippedEquations = [...root.querySelectorAll("figure.equation, .equation-main, .katex-display, .math-block")]
        .filter(isVisible)
        .map((el) => {
          const style = getComputedStyle(el);
          const clipped = /(hidden|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`);
          return {
            text: cleanText(el).slice(0, 160),
            scrollWidth: Math.ceil(el.scrollWidth),
            clientWidth: Math.ceil(el.clientWidth),
            scrollHeight: Math.ceil(el.scrollHeight),
            clientHeight: Math.ceil(el.clientHeight),
            overflow: `${style.overflow}/${style.overflowX}/${style.overflowY}`,
            clipped
          };
        })
        .filter((eq) => eq.clipped && ((eq.scrollWidth - eq.clientWidth > 3) || (eq.scrollHeight - eq.clientHeight > 3)))
        .slice(0, 12);

      const pageOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;

      const issueCount =
        rawTex.length +
        rawUnderscore.length +
        katexErrors.length +
        zeroWidthMathParts.length +
        wideTables.length +
        clippedCells.length +
        clippedEquations.length +
        (pageOverflow > 2 ? 1 : 0);

      return {
        page: pageName,
        lang,
        viewport,
        width: window.innerWidth,
        issueCount,
        rawTex,
        rawUnderscore,
        katexErrors,
        zeroWidthMathParts,
        wideTables,
        clippedCells,
        clippedEquations,
        tightCells,
        pageOverflow
      };
    },
    { pageName, lang, viewport }
  );
}
