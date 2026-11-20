// main.ts — entry program for the make.fun "news-image-20261120" bounty.
//
// The finished infographic — "20 November 2026 — The Day in One Image",
// a 1024x1024 PNG — is stored in this repository as entry.png.
// This program copies that image to the output location the grader
// expects, so the program is a faithful, deterministic delivery of the
// entry image.
//
// Node.js standard library only. No network access. The copy is a plain
// byte-for-byte file copy, so two runs always produce byte-identical
// output.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The bundled image lives next to this file, at the repository root.
const repoDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoDir, "entry.png");

// The grader sets MAKEFUN_OUTPUT_DIR; without it, write to /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : "/output";
const outputPath = join(outputDir, "entry.png");

if (!existsSync(sourcePath)) {
  console.error(`error: bundled image not found: ${sourcePath}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, outputPath);

// Sanity check: the written file must be a real PNG. If the bundled
// image were ever corrupted or truncated, failing loudly here beats
// shipping a broken entry that the grader would reject.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const header = readFileSync(outputPath).subarray(0, 8);
if (!header.equals(PNG_SIGNATURE)) {
  console.error(`error: output is not a valid PNG: ${outputPath}`);
  process.exit(1);
}

const bytes = statSync(outputPath).size;
console.log(`Wrote ${outputPath} (${bytes} bytes)`);
