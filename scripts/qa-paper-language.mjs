#!/usr/bin/env node

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const repoBase = process.argv[2] || "http://127.0.0.1:8864";
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pagesRoot = path.resolve("pages/paper_reviews");
const pages = fs
  .readdirSync(pagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((pageName) => fs.existsSync(path.join(pagesRoot, pageName, "index.html")))
  .sort((a, b) => a.localeCompare(b));

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
});
const context = await browser.newContext({ viewport: { width: 1280, height: 920 } });
const page = await context.newPage();
const results = [];

for (const pageName of pages) {
  await page.goto(
    `${repoBase}/pages/paper_reviews/${pageName}/index.html?qa=paper-language-${Date.now()}#main`,
    { waitUntil: "domcontentloaded", timeout: 30_000 }
  );
  await page.waitForTimeout(350);

  await setLanguage(page, "ko");
  await revealForQa(page);
  const ko = await scanLanguage(page, "ko");

  await setLanguage(page, "en");
  await revealForQa(page);
  const en = await scanLanguage(page, "en");

  const identicalBody = ko.bodyText.length > 120 && ko.bodyText === en.bodyText;
  const issues = [];
  if (ko.wrongPanel.length) issues.push("ko-panel-state");
  if (en.wrongPanel.length) issues.push("en-panel-state");
  if (ko.dataMismatches.length) issues.push("ko-data-mismatch");
  if (en.dataMismatches.length) issues.push("en-data-mismatch");
  if (ko.hangulCount < 20) issues.push("ko-body-has-too-little-hangul");
  if (en.koreanCandidates.length) issues.push("en-body-contains-korean");
  if (identicalBody) issues.push("ko-en-body-identical");

  results.push({
    page: pageName,
    issues,
    identicalBody,
    ko: compact(ko),
    en: compact(en),
  });
}

await browser.close();

const failures = results.filter((entry) => entry.issues.length);
const koNarrativeReview = results
  .filter((entry) => entry.ko.englishNarrativeCandidates.length)
  .map((entry) => ({
    page: entry.page,
    candidates: entry.ko.englishNarrativeCandidates,
  }));
const koCaptionReview = results
  .filter((entry) => entry.ko.englishCaptionCandidates.length)
  .map((entry) => ({
    page: entry.page,
    candidates: entry.ko.englishCaptionCandidates,
  }));
console.log(
  JSON.stringify(
    {
      pages: results.length,
      failureCount: failures.length,
      failures,
      koNarrativeReview,
      koCaptionReview,
      summary: results.map((entry) => ({
        page: entry.page,
        issues: entry.issues,
        koHangul: entry.ko.hangulCount,
        enHangul: entry.en.hangulCount,
      })),
    },
    null,
    2
  )
);

function compact(scan) {
  return {
    state: scan.state,
    hangulCount: scan.hangulCount,
    latinCount: scan.latinCount,
    panelState: scan.panelState,
    wrongPanel: scan.wrongPanel,
    dataMismatches: scan.dataMismatches.slice(0, 12),
    koreanCandidates: scan.koreanCandidates.slice(0, 20),
    englishOnlyCandidates: scan.englishOnlyCandidates.slice(0, 12),
    englishNarrativeCandidates: scan.englishNarrativeCandidates.slice(0, 20),
    englishCaptionCandidates: scan.englishCaptionCandidates.slice(0, 30),
  };
}

async function setLanguage(page, target) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const state = await page.evaluate(() => {
      const raw =
        document.documentElement.lang ||
        document.documentElement.dataset.pageLang ||
        document.body.dataset.pageLang ||
        "";
      return raw.toLowerCase().startsWith("en") ? "en" : "ko";
    });
    if (state === target) return;
    const button = page.locator("#langBtn");
    if ((await button.count()) === 0) return;
    await button.click({ timeout: 5_000 });
    await page.waitForTimeout(220);
  }
}

async function revealForQa(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll(".supplement-focus-backdrop, .details-focus-backdrop")
      .forEach((element) => element.remove());
    document.body.classList.remove("supplement-focus-open", "details-focus-open");
    document.documentElement.classList.remove("supplement-focus-open", "details-focus-open");
    document.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });
    document.querySelectorAll(".deep-dive-content").forEach((element) => {
      element.classList.remove("is-collapsed");
    });
    document.querySelectorAll(".toggle-panel-body, .details-content").forEach((element) => {
      if (element instanceof HTMLElement) element.style.maxHeight = "none";
    });
  });
}

async function scanLanguage(page, target) {
  return page.evaluate((target) => {
    const normalize = (value) => (value || "").replace(/\s+/g, " ").trim();
    const isVisible = (element) => {
      if (!(element instanceof Element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const cleanText = (element) => {
      const clone = element.cloneNode(true);
      clone
        .querySelectorAll(
          "script, style, annotation, .katex-mathml, .copy-status, .copy-block-button, [aria-hidden='true']"
        )
        .forEach((node) => node.remove());
      return normalize(clone.innerText || clone.textContent || "");
    };
    const stateRaw =
      document.documentElement.lang ||
      document.documentElement.dataset.pageLang ||
      document.body.dataset.pageLang ||
      "";
    const state = stateRaw.toLowerCase().startsWith("en") ? "en" : "ko";
    const panels = [...document.querySelectorAll("[data-lang-panel]")];
    const panelState = panels.map((panel) => ({
      lang: panel.getAttribute("data-lang-panel"),
      visible: isVisible(panel),
    }));
    const root = document.querySelector(".post-body") || document.body;
    const wrongPanel = panelState
      .filter((panel) =>
        panel.lang === target ? !panel.visible : panel.visible && ["ko", "en"].includes(panel.lang)
      )
      .map((panel) => `${panel.lang}:${panel.visible ? "visible" : "hidden"}`);
    if (panelState.length && !panelState.some((panel) => panel.lang === target)) {
      wrongPanel.push(`${target}:missing`);
    }
    const bodyText = normalize(root.innerText || root.textContent || "");
    const hangulCount = (bodyText.match(/[가-힣]/g) || []).length;
    const latinCount = (bodyText.match(/[A-Za-z]/g) || []).length;

    const dataMismatches = [...root.querySelectorAll("[data-ko][data-en]")]
      .filter((element) => isVisible(element) && element.children.length === 0)
      .map((element) => {
        const expected = normalize(element.getAttribute(`data-${target}`));
        const actual = cleanText(element);
        return { tag: element.tagName.toLowerCase(), expected, actual };
      })
      .filter((item) => item.expected && item.expected !== item.actual);

    const candidates = [...root.querySelectorAll("h1, h2, h3, h4, p, li, td, th, figcaption, summary")]
      .filter((element) => isVisible(element) && !element.closest(".comments"))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: cleanText(element),
      }))
      .filter((item) => item.text);
    const dedupe = (items) => {
      const seen = new Set();
      return items.filter((item) => {
        if (seen.has(item.text)) return false;
        seen.add(item.text);
        return true;
      });
    };
    const koreanCandidates = dedupe(
      candidates.filter((item) => (item.text.match(/[가-힣]/g) || []).length >= 2)
    );
    const englishOnlyCandidates = dedupe(
      candidates.filter((item) => {
        const latin = (item.text.match(/[A-Za-z]/g) || []).length;
        const hangul = (item.text.match(/[가-힣]/g) || []).length;
        return item.text.length >= 45 && latin >= 30 && hangul === 0;
      })
    );
    const englishNarrativeCandidates = englishOnlyCandidates.filter((item) =>
      ["h2", "h3", "h4", "p", "summary"].includes(item.tag)
    );
    const englishCaptionCandidates = dedupe(
      [...root.querySelectorAll(".caption-note")]
        .filter((element) => isVisible(element))
        .map((element) => ({ tag: "caption-note", text: cleanText(element) }))
        .filter((item) => {
          const latin = (item.text.match(/[A-Za-z]/g) || []).length;
          const hangul = (item.text.match(/[가-힣]/g) || []).length;
          return item.text.length >= 24 && latin >= 15 && hangul === 0;
        })
    );

    return {
      state,
      bodyText,
      hangulCount,
      latinCount,
      panelState,
      wrongPanel,
      dataMismatches,
      koreanCandidates,
      englishOnlyCandidates,
      englishNarrativeCandidates,
      englishCaptionCandidates,
    };
  }, target);
}
