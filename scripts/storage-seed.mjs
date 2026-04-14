#!/usr/bin/env node

/**
 * Seeds the Firebase Storage emulator from previously dumped files.
 *
 * Usage:
 *   node scripts/storage-seed.mjs                          # seed from emulator-seed/storage/
 *   node scripts/storage-seed.mjs ./custom-dir/             # seed from custom directory
 *
 * Prerequisites: Storage emulator must be running on localhost:9199
 */

import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";

const app = initializeApp({
  projectId: "malenovska-305f8",
  storageBucket: "malenovska-305f8",
});

const bucket = getStorage(app).bucket();

const walkDir = (dir) => {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
};

const main = async () => {
  const seedDir = process.argv[2] || "emulator-seed/storage";

  if (!existsSync(seedDir)) {
    console.error(`Directory not found: ${seedDir}`);
    console.error(
      "Run 'npm run emulators:dump' first to download production files.",
    );
    process.exit(1);
  }

  const files = walkDir(seedDir);

  if (files.length === 0) {
    console.log("  No files to seed.");
    process.exit(0);
  }

  console.log(
    `Seeding Storage emulator from ${seedDir} (${files.length} files)...\n`,
  );

  let success = 0;
  let failed = 0;

  for (const filePath of files) {
    const destination = relative(seedDir, filePath);
    try {
      await bucket.upload(filePath, { destination });
      success++;
      process.stdout.write(`\r  Uploaded ${success}/${files.length} files`);
    } catch (err) {
      failed++;
      console.error(`\n  Failed: ${destination} — ${err.message}`);
    }
  }

  console.log(
    `\n\n  Total: ✓ ${success} uploaded` +
      (failed > 0 ? `, ✗ ${failed} failed` : ""),
  );
  process.exit(failed > 0 ? 1 : 0);
};

main().catch((err) => {
  console.error("Storage seed failed:", err);
  process.exit(1);
});
