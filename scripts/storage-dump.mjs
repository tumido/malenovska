#!/usr/bin/env node

/**
 * Downloads all files from production Firebase Storage for local emulator use.
 * Uses Firebase Admin SDK with a service account.
 *
 * Usage:
 *   node scripts/storage-dump.mjs                          # dump to emulator-data/storage-seed/
 *   node scripts/storage-dump.mjs ./custom-dir/             # dump to custom directory
 *
 * Requires: malenovska-service-account.json in project root
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const serviceAccount = JSON.parse(
  readFileSync("malenovska-service-account.json", "utf-8"),
);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "malenovska-305f8.appspot.com",
});

const bucket = getStorage(app).bucket();

const main = async () => {
  const outDir = process.argv[2] || "emulator-data/storage-seed";

  console.log("Downloading production Storage files...\n");

  const [files] = await bucket.getFiles();

  if (files.length === 0) {
    console.log("  No files found in bucket.");
    process.exit(0);
  }

  let success = 0;
  let failed = 0;

  for (const file of files) {
    // Skip directory placeholders
    if (file.name.endsWith("/")) continue;

    const dest = join(outDir, file.name);
    try {
      mkdirSync(dirname(dest), { recursive: true });
      await file.download({ destination: dest });
      success++;
      process.stdout.write(`\r  Downloaded ${success}/${files.length} files`);
    } catch (err) {
      failed++;
      console.error(`\n  Failed: ${file.name} — ${err.message}`);
    }
  }

  console.log(`\n\n  Total: ✓ ${success} downloaded` + (failed > 0 ? `, ✗ ${failed} failed` : ""));
  console.log(`  Saved to ${outDir}/`);
  process.exit(failed > 0 ? 1 : 0);
};

main().catch((err) => {
  console.error("Storage dump failed:", err);
  process.exit(1);
});
