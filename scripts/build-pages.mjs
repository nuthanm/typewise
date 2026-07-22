#!/usr/bin/env node
/**
 * Builds static output for GitHub Pages (no API routes).
 * Temporarily moves app/api aside because static export does not support Route Handlers.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const apiDir = join(root, "app", "api");
const apiBackup = join(root, ".api-backup-pages-build");
const outDir = join(root, "out");

function backupApi() {
  if (!existsSync(apiDir)) return false;
  rmSync(apiBackup, { recursive: true, force: true });
  cpSync(apiDir, apiBackup, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
  return true;
}

function restoreApi() {
  if (!existsSync(apiBackup)) return;
  rmSync(apiDir, { recursive: true, force: true });
  cpSync(apiBackup, apiDir, { recursive: true });
  rmSync(apiBackup, { recursive: true, force: true });
}

function run() {
  let backedUp = false;
  try {
    backedUp = backupApi();

    const result = spawnSync(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "build"],
      {
        stdio: "inherit",
        env: { ...process.env, STATIC_EXPORT: "true" },
        shell: process.platform === "win32",
      },
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }

    if (!existsSync(outDir)) {
      console.error("Expected out/ after static export.");
      process.exit(1);
    }

    // Required on GitHub Pages so `_next/` and other underscored paths are served.
    writeFileSync(join(outDir, ".nojekyll"), "");

    console.log("Static export ready in out/");
  } finally {
    if (backedUp) restoreApi();
  }
}

run();
