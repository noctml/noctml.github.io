import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), sandbox, { filename: "data.js" });

const collections = [
  { key: "projects", prefix: "[프로젝트]" },
  { key: "study", prefix: "[스터디]" },
  { key: "paperReviews", prefix: "[논문리뷰]" },
  { key: "paperSummaries", prefix: "[논문요약]" },
];

function localFile(href) {
  const clean = String(href || "").split(/[?#]/, 1)[0].replace(/^\/+/, "");
  if (!clean) return null;
  const candidate = path.join(root, clean);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, "index.html");
  }
  return path.extname(candidate) ? candidate : path.join(candidate, "index.html");
}

let changed = 0;

for (const { key, prefix } of collections) {
  for (const item of sandbox.window.SITE_DATA?.[key] || []) {
    if (item.published === false || !item.href || !item.title) continue;
    const file = localFile(item.href);
    if (!file || !fs.existsSync(file)) continue;

    const pageTitle = `${prefix} ${String(item.title).trim()} | Insighted`;
    const original = fs.readFileSync(file, "utf8");
    const updated = original
      .replace(/<title>[^<]*<\/title>/i, `<title>${pageTitle}</title>`)
      .replace(/(<meta\b[^>]*\bproperty=["']og:title["'][^>]*\bcontent=["'])[^"']*(["'][^>]*>)/i, `$1${pageTitle}$2`)
      .replace(/(<meta\b[^>]*\bcontent=["'])[^"']*(["'][^>]*\bproperty=["']og:title["'][^>]*>)/i, `$1${pageTitle}$2`);

    if (updated !== original) {
      fs.writeFileSync(file, updated);
      changed += 1;
    }
  }
}

console.log(`Synchronized title prefixes for ${changed} pages.`);
