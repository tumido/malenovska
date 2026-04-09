#!/usr/bin/env node

/**
 * One-time migration: rewrites all Firestore document URLs from the legacy
 * malenovska-305f8.appspot.com bucket to malenovska-305f8.firebasestorage.app.
 *
 * Usage:
 *   node scripts/migrate-storage-urls.mjs              # dry-run (default)
 *   node scripts/migrate-storage-urls.mjs --apply       # apply changes to production
 *
 * Requires: malenovska-service-account.json in project root
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const OLD_BUCKET = "malenovska-305f8.appspot.com";
const NEW_BUCKET = "malenovska-305f8";

const COLLECTIONS = ["events", "legends", "races", "participants", "galleries", "config"];

const dryRun = !process.argv.includes("--apply");

const serviceAccount = JSON.parse(
  readFileSync("malenovska-service-account.json", "utf-8"),
);

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const rewriteValue = (val) => {
  if (val === null || val === undefined) return { value: val, changed: false };
  if (typeof val === "string") {
    if (val.includes(OLD_BUCKET)) {
      return { value: val.replaceAll(OLD_BUCKET, NEW_BUCKET), changed: true };
    }
    return { value: val, changed: false };
  }
  if (Array.isArray(val)) {
    let anyChanged = false;
    const arr = val.map((item) => {
      const r = rewriteValue(item);
      if (r.changed) anyChanged = true;
      return r.value;
    });
    return { value: arr, changed: anyChanged };
  }
  if (typeof val === "object" && val.constructor?.name !== "Timestamp" && val.constructor?.name !== "GeoPoint") {
    let anyChanged = false;
    const obj = {};
    for (const [k, v] of Object.entries(val)) {
      const r = rewriteValue(v);
      obj[k] = r.value;
      if (r.changed) anyChanged = true;
    }
    return { value: obj, changed: anyChanged };
  }
  return { value: val, changed: false };
};

const migrateCollection = async (name) => {
  const snap = await db.collection(name).get();
  let updated = 0;

  const batch = db.batch();

  for (const doc of snap.docs) {
    const data = doc.data();
    const { value: rewritten, changed } = rewriteValue(data);

    if (changed) {
      updated++;
      console.log(`  ${name}/${doc.id}`);
      if (!dryRun) {
        batch.update(doc.ref, rewritten);
      }
    }
  }

  if (!dryRun && updated > 0) {
    await batch.commit();
  }

  return updated;
};

const migrateParticipantPrivate = async () => {
  const participants = await db.collection("participants").get();
  let updated = 0;

  for (const pDoc of participants.docs) {
    const privSnap = await pDoc.ref.collection("private").get();
    for (const doc of privSnap.docs) {
      const data = doc.data();
      const { value: rewritten, changed } = rewriteValue(data);

      if (changed) {
        updated++;
        console.log(`  participants/${pDoc.id}/private/${doc.id}`);
        if (!dryRun) {
          await doc.ref.update(rewritten);
        }
      }
    }
  }

  return updated;
};

const main = async () => {
  console.log(`\nFirestore Storage URL Migration: ${OLD_BUCKET} → ${NEW_BUCKET}`);
  console.log(`Mode: ${dryRun ? "DRY RUN (pass --apply to write changes)" : "APPLYING CHANGES"}\n`);

  let totalUpdated = 0;

  for (const name of COLLECTIONS) {
    const count = await migrateCollection(name);
    totalUpdated += count;
  }

  const privCount = await migrateParticipantPrivate();
  totalUpdated += privCount;

  console.log(`\n  Total documents ${dryRun ? "to update" : "updated"}: ${totalUpdated}`);
  if (dryRun && totalUpdated > 0) {
    console.log("  Run with --apply to write changes to Firestore.");
  }

  process.exit(0);
};

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
