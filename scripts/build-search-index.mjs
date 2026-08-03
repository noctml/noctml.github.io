import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: "data.js" });

const siteData = sandbox.window.SITE_DATA || {};
const collections = [
  { key: "projects", type: "project", prefix: "[프로젝트]", category: "Projects" },
  { key: "study", type: "study", prefix: "[스터디]", category: "Study" },
  { key: "paperReviews", type: "paper-review", prefix: "[논문리뷰]", category: "Paper Reviews" },
  { key: "paperSummaries", type: "paper-summary", prefix: "[논문요약]", category: "Paper Summary" },
];

const entities = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["hellip", "..."],
  ["laquo", "<<"],
  ["ldquo", "\""],
  ["lsquo", "'"],
  ["lt", "<"],
  ["mdash", "-"],
  ["middot", "·"],
  ["nbsp", " "],
  ["ndash", "-"],
  ["quot", "\""],
  ["raquo", ">>"],
  ["rdquo", "\""],
  ["rsquo", "'"],
]);

function decodeEntities(value) {
  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const hexadecimal = entity[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      if (Number.isFinite(codePoint)) return String.fromCodePoint(codePoint);
      return match;
    }
    return entities.get(entity.toLowerCase()) ?? match;
  });
}

function textFromHtml(source) {
  const mainMatch = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let html = mainMatch?.[1] || source;
  html = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|form|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/((?:p)|(?:h[1-6])|(?:li)|(?:div)|(?:section)|(?:article)|(?:figcaption)|(?:tr)|(?:td)|(?:th))>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(html).replace(/\s+/g, " ").trim().slice(0, 50000);
}

function localFileForHref(href) {
  const cleanHref = String(href || "")
    .replace(/^https?:\/\/[^/]+/i, "")
    .split(/[?#]/, 1)[0]
    .replace(/^\/+/, "");
  if (!cleanHref) return null;
  const candidate = path.join(root, cleanHref);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, "index.html");
  }
  return path.extname(candidate) ? candidate : path.join(candidate, "index.html");
}

function publicUrl(href) {
  const cleanHref = String(href || "").split(/[?#]/, 1)[0];
  return cleanHref.startsWith("/") ? cleanHref : `/${cleanHref}`;
}

const seen = new Set();
const store = [];

for (const collection of collections) {
  for (const item of siteData[collection.key] || []) {
    if (item.published === false || !item.href) continue;
    const dedupeKey = `${collection.type}:${publicUrl(item.href)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const file = localFileForHref(item.href);
    const content = file && fs.existsSync(file) ? textFromHtml(fs.readFileSync(file, "utf8")) : "";
    const description = String(item.desc || "").trim();
    const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean).map(String) : [];

    store.push({
      title: `${collection.prefix} ${String(item.title || "").trim()}`,
      description,
      excerpt: [description, content].filter(Boolean).join(" "),
      categories: collection.category,
      tags: tags.join(" "),
      url: publicUrl(item.href),
      teaser: item.thumb ? publicUrl(item.thumb) : "",
    });
  }
}

const outputDir = path.join(root, "assets", "js");
fs.mkdirSync(outputDir, { recursive: true });
const output = `window.SITE_SEARCH_INDEX = ${JSON.stringify(store)};\n`;
fs.writeFileSync(path.join(outputDir, "site-search-index.js"), output);

console.log(`Built search index for ${store.length} published pages.`);
