#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const queueArgIndex = process.argv.indexOf("--queue");
const queuePath = queueArgIndex >= 0 && process.argv[queueArgIndex + 1]
  ? path.resolve(repoRoot, process.argv[queueArgIndex + 1])
  : path.join(repoRoot, "pages/paper_reviews/REDESIGN_BATCH_10_QUEUE.md");
const asJson = process.argv.includes("--json");
const startNext = process.argv.includes("--start-next");
const completeIndex = process.argv.indexOf("--complete");
const completePage = completeIndex >= 0 ? process.argv[completeIndex + 1] : null;

if (!fs.existsSync(queuePath)) {
  console.error(`Missing queue file: ${queuePath}`);
  process.exit(1);
}

const queueText = fs.readFileSync(queuePath, "utf8");
const queueLines = queueText.split(/\r?\n/);
const rowLineIndexes = [];
const rows = queueLines
  .map((line, index) => ({ line, index }))
  .filter(({ line }) => /^\|\s*\d+\s*\|/.test(line))
  .map(({ line, index }) => {
    rowLineIndexes.push(index);
    return line;
  })
  .map((line) => line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim()))
  .map(([order, status, page, pdf, pagePath, personalNotePolicy, notes]) => ({
    order: Number(order),
    status,
    page,
    pdf: pdf.replace(/^`|`$/g, ""),
    pagePath: pagePath.replace(/^`|`$/g, ""),
    personalNotePolicy,
    notes,
  }));

const excludedPages = ["ORB-SLAM2", "DROID-W", "DynaSLAM"];
const invalidTargets = rows.filter((row) => excludedPages.includes(row.page));
const activeRows = rows.filter((row) => row.status === "in_progress");

if (activeRows.length > 1) {
  console.error(`Queue has multiple in_progress rows: ${activeRows.map((row) => row.page).join(", ")}`);
  process.exit(1);
}

const rowToMarkdown = (row) => (
  `| ${row.order} | ${row.status} | ${row.page} | \`${row.pdf}\` | \`${row.pagePath}\` | ${row.personalNotePolicy} | ${row.notes} |`
);

const writeRows = () => {
  rows.forEach((row, index) => {
    queueLines[rowLineIndexes[index]] = rowToMarkdown(row);
  });
  fs.writeFileSync(queuePath, `${queueLines.join("\n").replace(/\n*$/, "")}\n`);
};

let action = "inspect";
let actionMessage = null;

if (completePage) {
  const target = rows.find((row) => row.page === completePage);
  if (!target) {
    console.error(`Cannot complete unknown page: ${completePage}`);
    process.exit(1);
  }
  target.status = "done";
  writeRows();
  action = "complete";
  actionMessage = `Marked ${completePage} as done.`;
}

if (startNext) {
  const currentActive = rows.find((row) => row.status === "in_progress");
  if (currentActive) {
    action = "start-next";
    actionMessage = `${currentActive.page} is already in_progress.`;
  } else {
    const pending = rows.find((row) => row.status === "pending");
    if (!pending) {
      action = "start-next";
      actionMessage = "No pending page remains.";
    } else {
      pending.status = "in_progress";
      writeRows();
      action = "start-next";
      actionMessage = `Marked ${pending.page} as in_progress.`;
    }
  }
}

const next = rows.find((row) => row.status === "in_progress") || rows.find((row) => row.status === "pending");

const missingFiles = rows.flatMap((row) => {
  const checks = [
    { kind: "pdf", file: row.pdf },
    { kind: "page", file: path.join(repoRoot, row.pagePath, "index.html") },
    { kind: "script", file: path.join(repoRoot, row.pagePath, "script.js") },
    { kind: "styles", file: path.join(repoRoot, row.pagePath, "styles.css") },
  ];
  return checks
    .filter((check) => !fs.existsSync(check.file))
    .map((check) => ({ page: row.page, ...check }));
});

const result = {
  queue: path.relative(repoRoot, queuePath),
  action,
  actionMessage,
  total: rows.length,
  pending: rows.filter((row) => row.status === "pending").length,
  inProgress: rows.filter((row) => row.status === "in_progress").length,
  done: rows.filter((row) => row.status === "done").length,
  invalidTargets: invalidTargets.map((row) => row.page),
  missingFiles,
  next: next || null,
  policy: {
    activeReference: "DROID-W",
    excludedPages,
    absorbedReferenceQa: [
      "ORB-SLAM2 paired figure",
      "ORB-SLAM2 original KaTeX restoration",
      "ORB-SLAM2 equation caption baseline",
      "ORB-SLAM2 Korean caption cleanup",
    ],
    preservePersonalNotesOnlyInQueue: ["DROID-SLAM", "3D_SG"],
    placeholderKo: "(진행중...)",
    placeholderEn: "(In progress...)",
  },
};

if (invalidTargets.length) {
  result.warning = `Queue contains excluded pages; remove ${invalidTargets.map((row) => row.page).join(", ")} before starting.`;
}

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Queue: ${result.queue}`);
  if (result.actionMessage) console.log(`Action: ${result.actionMessage}`);
  console.log(`Status: ${result.done} done / ${result.inProgress} in_progress / ${result.pending} pending / ${result.total} total`);
  if (result.warning) console.log(`Warning: ${result.warning}`);
  if (missingFiles.length) {
    console.log("Missing files:");
    missingFiles.forEach((item) => console.log(`- ${item.page} ${item.kind}: ${item.file}`));
  }
  if (!next) {
    console.log("Next: none");
  } else {
    console.log(`Next: #${next.order} ${next.page}`);
    console.log(`PDF: ${next.pdf}`);
    console.log(`Page path: ${next.pagePath}`);
    console.log(`Personal notes: ${next.personalNotePolicy}`);
    console.log(`Notes: ${next.notes}`);
  }
}
