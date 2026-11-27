// RumahBudget entry program (Node 22, standard library only).
//
// The site is plain static files under app/ next to this file, and the
// screenshots of it running are under screenshots/. This program hands the
// entry in: it copies both folders into the output directory and writes
// dossier.json there with the vendored make.fun library, so the judge reads
// exactly the site and screenshots the repository holds.
//
// The grader runs this program twice in a fresh container with /output as
// the target; outside the grader, MAKEFUN_OUTPUT_DIR stands in for it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Both runs must write identical bytes, so nothing here depends on the
// clock, the environment, or the order the filesystem lists files in.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The output directory is a mounted volume in the grader, so it must never
// be removed — only created if missing. (rmSync on a mount point throws
// EBUSY, which killed the first submission with exit code 1.)
mkdirSync(outDir, { recursive: true });

// The whole site, as shipped: app/index.html opens it in a browser.
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });

// The maker's own screenshots of the site running (the first by name is
// the cover). The folder is optional in the repo but this entry ships it.
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// The dossier the judge reads: byte for byte what the library writes from
// the app/ and screenshots/ just copied, under the scorer's own caps,
// stated once here so the two runs can never drift apart.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};
const dossier = buildDossier(outDir, DOSSIER_CAPS);
writeFileSync(join(outDir, "dossier.json"), dossier);
