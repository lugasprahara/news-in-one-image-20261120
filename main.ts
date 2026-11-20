// Entry program for news-image-20261120.
//
// The repository ships a finished infographic, entry.png, drawn as an
// HTML/SVG page (index.html) and rendered once to PNG. The harness runs
// this program with no network and wants the picture at a fixed output
// path, so the program only has to put a copy of the bundled PNG there:
//
//   destination = $MAKEFUN_OUTPUT_DIR/entry.png   when that variable
//                                                  is set (local runs)
//               = /output/entry.png                otherwise (grader)
//
// Node 22 standard library only. Try it locally with:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve everything from this file's own directory. Relying on the
// caller's working directory would break as soon as the harness runs
// the program from somewhere else.
const folder = dirname(fileURLToPath(import.meta.url));
const bundled = join(folder, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.png");

// The output folder may not exist yet in a fresh sandbox, so make it
// (recursively, and quietly if it is already there).
mkdirSync(outDir, { recursive: true });
copyFileSync(bundled, outFile);

console.log("wrote " + outFile + " (" + statSync(outFile).size + " bytes)");
