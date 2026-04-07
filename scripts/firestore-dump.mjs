#!/usr/bin/env node

/**
 * Dumps production Firestore data to a JSON file for seeding emulators.
 * Uses Firebase Admin SDK with a service account to bypass security rules.
 *
 * Usage:
 *   node scripts/firestore-dump.mjs                     # dump to emulator-data/seed.json
 *   node scripts/firestore-dump.mjs ./custom-path.json  # dump to custom path
 *
 * Requires: malenovska-service-account.json in project root
 *   (download from Firebase Console → Project Settings → Service Accounts)
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const serviceAccount = JSON.parse(
  readFileSync("malenovska-service-account.json", "utf-8")
);

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const COLLECTIONS = ["events", "legends", "races", "participants", "galleries"];

let totalSuccess = 0;
let totalFailed = 0;

const statusLine = (label, success, failed, total, done) => {
  const progress = total ? ` ${success + failed}/${total}` : "";
  const failStr = failed > 0 ? ` ✗ ${failed}` : "";
  const marker = done ? (failed > 0 ? "✗" : "✓") : "…";
  process.stdout.write(`\r  ${marker} ${label}${progress} — ✓ ${success}${failStr}${done ? "\n" : ""}`);
};

const serializeValue = (val) => {
  if (val === null || val === undefined) return val;
  if (val?.toDate && typeof val.toDate === "function") {
    return { __type: "timestamp", seconds: val._seconds ?? val.seconds, nanoseconds: val._nanoseconds ?? val.nanoseconds };
  }
  if (val?.latitude !== undefined && val?.longitude !== undefined && val.constructor?.name === "GeoPoint") {
    return { __type: "geopoint", latitude: val.latitude, longitude: val.longitude };
  }
  if (Array.isArray(val)) return val.map(serializeValue);
  if (typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, serializeValue(v)])
    );
  }
  return val;
};

const dumpCollection = async (name) => {
  statusLine(name, 0, 0, null, false);
  try {
    const snap = await db.collection(name).get();
    const docs = {};
    let success = 0;
    for (const d of snap.docs) {
      docs[d.id] = serializeValue(d.data());
      success++;
      statusLine(name, success, 0, snap.size, false);
    }
    totalSuccess += success;
    statusLine(name, success, 0, snap.size, true);
    return docs;
  } catch {
    totalFailed++;
    statusLine(name, 0, 1, null, true);
    return {};
  }
};

const dumpParticipantPrivate = async (participantIds) => {
  const label = "participants/*/private";
  const total = participantIds.length;
  let success = 0;
  let failed = 0;
  statusLine(label, 0, 0, total, false);

  const subs = {};
  for (const pid of participantIds) {
    try {
      const snap = await db.collection("participants").doc(pid).collection("private").get();
      if (!snap.empty) {
        subs[pid] = {};
        for (const d of snap.docs) {
          subs[pid][d.id] = serializeValue(d.data());
        }
      }
      success++;
    } catch {
      failed++;
    }
    statusLine(label, success, failed, total, false);
  }
  totalSuccess += success;
  totalFailed += failed;
  statusLine(label, success, failed, total, true);
  return subs;
};

const dumpConfig = async () => {
  const label = "config";
  statusLine(label, 0, 0, 1, false);
  try {
    const snap = await db.doc("config/config").get();
    if (snap.exists) {
      totalSuccess++;
      statusLine(label, 1, 0, 1, true);
      return serializeValue(snap.data());
    }
    statusLine(label, 0, 0, 1, true);
    return null;
  } catch {
    totalFailed++;
    statusLine(label, 0, 1, 1, true);
    return null;
  }
};

const main = async () => {
  const outPath = process.argv[2] || "emulator-data/seed.json";

  console.log("Dumping production Firestore data (Admin SDK)...\n");

  const dump = { __exportedAt: new Date().toISOString() };

  for (const name of COLLECTIONS) {
    dump[name] = await dumpCollection(name);
  }

  const participantIds = Object.keys(dump.participants || {});
  if (participantIds.length > 0) {
    dump._participantPrivate = await dumpParticipantPrivate(participantIds);
  }

  dump.config = { config: await dumpConfig() };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(dump, null, 2));

  console.log(`\n  Total: ✓ ${totalSuccess} succeeded` + (totalFailed > 0 ? `, ✗ ${totalFailed} failed` : ""));
  console.log(`  Written to ${outPath}`);
  process.exit(totalFailed > 0 ? 1 : 0);
};

main().catch((err) => {
  console.error("Dump failed:", err);
  process.exit(1);
});
