#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const pageArg = process.argv[2];

if (!pageArg) {
  console.error('Usage: node scripts/verify-paper-review.mjs <PAGE|path/to/page>');
  process.exit(1);
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHiddenMathMetadata(value) {
  return value
    .replace(/<annotation\b[\s\S]*?<\/annotation>/gi, ' ')
    .replace(/<span\b[^>]*class=["'][^"']*\bkatex-mathml\b[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, ' ');
}

function decodeSrc(src) {
  try {
    return decodeURIComponent(src);
  } catch {
    return src;
  }
}

function allMatches(text, regex) {
  return [...text.matchAll(regex)];
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return match ? match[1] : '';
}

const pageDir = pageArg.includes('/')
  ? path.resolve(repoRoot, pageArg.replace(/\/index\.html$/, ''))
  : path.resolve(repoRoot, 'pages/paper_reviews', pageArg);
const indexPath = path.join(pageDir, 'index.html');
const scriptPath = path.join(pageDir, 'script.js');
const stylePath = path.join(pageDir, 'styles.css');
const pageName = path.basename(pageDir);

if (!fs.existsSync(indexPath)) {
  console.error(`Missing index.html: ${indexPath}`);
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const warnings = [];
const errors = [];

const imageTags = allMatches(html, /<img\b[^>]*>/gi).map((m) => m[0]);
const images = imageTags.map((tag) => {
  const src = getAttr(tag, 'src');
  const localPath = src && !/^https?:\/\//.test(src)
    ? path.join(pageDir, decodeSrc(src).split('#')[0].split('?')[0])
    : null;
  return {
    src,
    alt: getAttr(tag, 'alt'),
    width: tag.match(/style=["'][^"']*width\s*:\s*([^;"']+)/i)?.[1] || '',
    exists: localPath ? fs.existsSync(localPath) : true,
  };
});

const missingImages = images.filter((img) => !img.exists);
const missingAlt = images.filter((img) => !img.alt);

if (missingImages.length) errors.push(`${missingImages.length} image src path(s) missing`);
if (missingAlt.length) warnings.push(`${missingAlt.length} image(s) missing alt text`);

function panelLangAt(index) {
  const before = html.slice(0, index);
  const ko = before.lastIndexOf('data-lang-panel="ko"');
  const en = before.lastIndexOf('data-lang-panel="en"');
  if (ko === -1 && en === -1) return 'shared';
  return ko > en ? 'ko' : 'en';
}

const figureEntries = [];
for (const match of html.matchAll(/<figure\b[\s\S]*?<\/figure>/gi)) {
  const block = match[0];
  const caption = stripTags(block.match(/<figcaption[\s\S]*?<\/figcaption>/i)?.[0] || '');
  const imgTag = block.match(/<img\b[^>]*>/i)?.[0] || '';
  const src = getAttr(imgTag, 'src');
  const label = caption.match(/\b(Fig(?:ure)?\.?|Table)\s*([IVXLC]+|\d+)/i);
  figureEntries.push({
    lang: panelLangAt(match.index || 0),
    isEquation: /\bclass=["'][^"']*\bequation\b/i.test(block),
    kind: label ? (label[1].toLowerCase().startsWith('table') ? 'Table' : 'Fig') : '',
    number: label ? label[2] : '',
    src,
    caption,
  });
}

const labeledFigures = figureEntries.filter((entry) => entry.kind && entry.number);
const labelGroups = new Map();
for (const entry of labeledFigures) {
  const key = `${entry.lang}:${entry.kind} ${entry.number}`;
  const group = labelGroups.get(key) || [];
  group.push(entry);
  labelGroups.set(key, group);
}
for (const [key, group] of labelGroups) {
  if (group.length > 1) {
    const srcs = [...new Set(group.map((entry) => entry.src || '(no src)'))];
    warnings.push(`${key} appears ${group.length} time(s) in the same language panel: ${srcs.join(', ')}`);
  }
}

const srcLabelGroups = new Map();
for (const entry of labeledFigures.filter((entry) => entry.src)) {
  const key = `${entry.lang}:${entry.src}`;
  const labels = srcLabelGroups.get(key) || new Set();
  labels.add(`${entry.kind} ${entry.number}`);
  srcLabelGroups.set(key, labels);
}
for (const [key, labels] of srcLabelGroups) {
  if (labels.size > 1) warnings.push(`${key.replace(':', ' ')} is reused with multiple figure/table labels: ${[...labels].join(', ')}`);
}

const missingFigureCaptions = figureEntries.filter((entry) => !entry.isEquation && !entry.caption).length;
if (missingFigureCaptions) warnings.push(`${missingFigureCaptions} figure(s) missing figcaption`);

for (const lang of ['ko', 'en']) {
  const nums = labeledFigures
    .filter((entry) => entry.lang === lang && entry.kind === 'Fig' && /^\d+$/.test(entry.number))
    .map((entry) => Number(entry.number));
  if (nums.length && Math.min(...nums) > 1) {
    warnings.push(`${lang} figure labels start at Fig. ${Math.min(...nums)}; confirm earlier PDF figures are absent or intentionally omitted in the report`);
  }
}

const equationFigures = allMatches(html, /<figure\b[^>]*class=["'][^"']*\bequation\b[^"']*["'][^>]*>[\s\S]*?<\/figure>/gi).map((m) => m[0]);
const equationTags = equationFigures.map((fig) => {
  const tag = fig.match(/<span\b[^>]*class=["'][^"']*\bequation-tag\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
  return tag ? stripTags(tag[1]) : '';
});
const missingEquationTags = equationTags.filter((tag) => !tag).length;
if (missingEquationTags) warnings.push(`${missingEquationTags} equation figure(s) without .equation-tag`);

const rawInlineMath = [];
const flatInlineFractions = [];
for (const match of allMatches(html, /<span\b[^>]*class=["'][^"']*\binline-math\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)) {
  const text = stripTags(match[1]);
  if (/[A-Za-z0-9α-ωΑ-Ωπθτλξωŷĉ]\s*[_^]\s*[A-Za-z0-9{]/.test(text)) {
    rawInlineMath.push(text);
  }
  const tokenHtml = match[0];
  const looksLikeFraction = /\\frac|∂[^/]{0,80}\/|TC\s*\/|[A-Za-z0-9)]\s*\/\s*[A-Za-z0-9(]/.test(text);
  const isUnit = /\b(ms|m|cm|km|s|sec|frame|FPS|Hz)\s*\/\s*(frame|s|sec|m|cm|km|Hz)\b/i.test(text);
  const isStructured = /\binline-fraction-token\b|\binline-frac\b/.test(tokenHtml);
  if (looksLikeFraction && !isUnit && !isStructured) flatInlineFractions.push(text);
}
if (rawInlineMath.length) errors.push(`${rawInlineMath.length} inline math token(s) contain raw _/^`);
if (flatInlineFractions.length) errors.push(`${flatInlineFractions.length} inline math fraction(s) look flattened; use KaTeX or stacked fraction markup`);

const visibleMathText = stripTags(stripHiddenMathMetadata(html));
if (/\\frac/.test(visibleMathText)) errors.push('visible raw \\frac token found outside hidden KaTeX annotation');

const rawEquationMath = [];
for (const match of allMatches(html, /<div\b[^>]*class=["'][^"']*\bequation-main\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)) {
  if (/\bkatex\b/.test(match[1])) continue;
  const text = stripTags(stripHiddenMathMetadata(match[1]));
  if (/[A-Za-z0-9α-ωΑ-Ωπθτλξωŷĉ]\s*[_^]\s*[A-Za-z0-9{]/.test(text)) {
    rawEquationMath.push(text);
  }
}
if (rawEquationMath.length) errors.push(`${rawEquationMath.length} block equation(s) contain raw _/^`);

const detailBlocks = allMatches(html, /<details\b[\s\S]*?<\/details>/gi).map((m) => m[0]);
const relatedDetails = detailBlocks.filter((block) => /(Related|related|문헌|선행|관련)/.test(stripTags(block.match(/<summary[\s\S]*?<\/summary>/i)?.[0] || '')));
const thinRelated = relatedDetails.filter((block) => {
  const text = stripTags(block);
  const hasVisual = /<table|supplement-card|summary-table|card-grid/.test(block);
  const hasAxis = /(장점|한계|남는|약점|위치|차이|연결|빈틈|contribute|gap|strength|weak|connect|position|difference|adds|remaining)/i.test(text);
  return text.length < 700 || !hasVisual || !hasAxis;
});
if (thinRelated.length) warnings.push(`${thinRelated.length} Related Work/details block(s) may be too thin`);

const hasLangButton = /id=["']langBtn["']/.test(html);
const hasThemeButton = /id=["']themeBtn["']/.test(html);
const hasBookmark = /id=["']sectionBookmarkList["']|class=["'][^"']*section-bookmark/.test(html);
const hasDeepDive = /id=["']deep-dive-title["']|class=["'][^"']*\bdeep-dive\b/.test(html);
const hasReveal = /deepDiveMoreBtn|deepDiveReveal|deep-dive-more/.test(html);
const hasComments = /giscus|utterances|comments|comment/i.test(html);

if (!hasLangButton) warnings.push('language toggle not found');
if (!hasThemeButton) warnings.push('theme toggle not found');
if (!hasBookmark) warnings.push('right bookmark markup not found');
if (!hasDeepDive) warnings.push('deep dive section not found');
if (!hasReveal) warnings.push('deep dive reveal control not found');
if (!hasComments) warnings.push('comments marker not found');
if (!fs.existsSync(scriptPath)) warnings.push('script.js not found');
if (!fs.existsSync(stylePath)) warnings.push('styles.css not found');
if (fs.existsSync(stylePath)) {
  const styleText = fs.readFileSync(stylePath, 'utf8');
  const hasInlineTokens = /\b(inline-math|notion-text-equation-token|math-token|model-token|equation-chip-part)\b/.test(html);
  if (hasInlineTokens && !/Unified inline equation theme/.test(styleText)) {
    warnings.push('unified inline equation theme CSS marker not found');
  }
  if (/\bequation-frac\b/.test(html) && !/Structured HTML equation fractions/.test(styleText)) {
    errors.push('structured equation fraction markup exists but matching CSS marker is missing');
  }
}

const koSections = allMatches(html, /id=["']ko-[^"']+["']/g).length;
const enSections = allMatches(html, /id=["']en-[^"']+["']/g).length;
const dataEn = allMatches(html, /data-en=/g).length;
const dataKo = allMatches(html, /data-ko=/g).length;

const topKoreanInEnglishHints = [];
for (const match of allMatches(html, /<h3 id=["']en-[^"']+["'][^>]*>/gi)) {
  const sectionStart = html.lastIndexOf('<section', match.index || 0);
  const start = sectionStart < 0 ? match.index || 0 : sectionStart;
  const nextSection = html.indexOf('<section class="deep-section"', start + 1);
  const deepDiveControls = html.indexOf('<div class="deep-dive-more', start + 1);
  const endCandidates = [nextSection, deepDiveControls].filter((index) => index > start);
  const end = endCandidates.length ? Math.min(...endCandidates) : html.length;
  const block = html.slice(start, end);
  const text = stripTags(block);
  if (/[가-힣]{2,}/.test(text)) topKoreanInEnglishHints.push(text.slice(0, 140));
}
if (topKoreanInEnglishHints.length) warnings.push(`${topKoreanInEnglishHints.length} EN section(s) contain Korean text candidates`);

const title = stripTags(html.match(/<title[\s\S]*?<\/title>/i)?.[0] || '');
const paperMeta = stripTags(html.match(/<p\b[^>]*class=["'][^"']*\bpaper-title-meta\b[^"']*["'][^>]*>[\s\S]*?<\/p>/i)?.[0] || '');

const status = errors.length ? 'needs_fix' : warnings.length ? 'review_warnings' : 'static_pass';

console.log(`# Static Verification Snapshot: ${pageName}`);
console.log('');
console.log(`- Status: ${status}`);
console.log(`- Page: \`${path.relative(repoRoot, indexPath)}\``);
console.log(`- Title: ${title || '(missing)'}`);
console.log(`- Paper meta: ${paperMeta || '(missing)'}`);
console.log('');
console.log('## Counts');
console.log('');
console.log(`- Images: ${images.length}`);
console.log(`- Figure/table entries: ${figureEntries.length}`);
console.log(`- Equation figures: ${equationFigures.length}`);
console.log(`- Equation tags: ${equationTags.filter(Boolean).length}`);
console.log(`- Details blocks: ${detailBlocks.length}`);
console.log(`- Related details: ${relatedDetails.length}`);
console.log(`- KO section ids: ${koSections}`);
console.log(`- EN section ids: ${enSections}`);
console.log(`- data-ko/data-en attributes: ${dataKo}/${dataEn}`);
console.log('');
console.log('## Errors');
console.log('');
if (errors.length) {
  for (const item of errors) console.log(`- ${item}`);
} else {
  console.log('- None from static scan.');
}
console.log('');
console.log('## Warnings');
console.log('');
if (warnings.length) {
  for (const item of warnings) console.log(`- ${item}`);
} else {
  console.log('- None from static scan.');
}
console.log('');
console.log('## Samples');
console.log('');
if (missingImages.length) {
  console.log('Missing images:');
  for (const img of missingImages.slice(0, 8)) console.log(`- ${img.src}`);
}
if (rawInlineMath.length) {
  console.log('Raw inline math candidates:');
  for (const text of rawInlineMath.slice(0, 8)) console.log(`- ${text}`);
}
if (rawEquationMath.length) {
  console.log('Raw block math candidates:');
  for (const text of rawEquationMath.slice(0, 8)) console.log(`- ${text}`);
}
if (thinRelated.length) {
  console.log('Thin Related Work candidates:');
  for (const block of thinRelated.slice(0, 4)) {
    const summary = stripTags(block.match(/<summary[\s\S]*?<\/summary>/i)?.[0] || '(no summary)');
    console.log(`- ${summary}`);
  }
}
if (topKoreanInEnglishHints.length) {
  console.log('Korean text candidates inside EN sections:');
  for (const text of topKoreanInEnglishHints.slice(0, 6)) console.log(`- ${text}`);
}
if (labeledFigures.length) {
  console.log('Figure/table inventory preview:');
  for (const entry of labeledFigures.slice(0, 40)) {
    const srcName = entry.src ? path.basename(decodeSrc(entry.src).split('#')[0].split('?')[0]) : '(no src)';
    console.log(`- [${entry.lang}] ${entry.kind}. ${entry.number} :: ${srcName} :: ${entry.caption.slice(0, 110)}`);
  }
  if (labeledFigures.length > 40) console.log(`- ... ${labeledFigures.length - 40} more`);
}
console.log('');
console.log('## Manual Gates Still Required');
console.log('');
console.log('- PDF claim/evaluation/conclusion comparison');
console.log('- numbered equation coverage against the PDF');
console.log('- figure/table caption and claim-evidence comparison');
console.log('- browser check for KO/EN, image width, toggles, bookmarks, and inline math baseline');
