#!/usr/bin/env node

/**
 * Seeds the Firestore emulator from a dump file.
 * Uses Firebase Admin SDK to bypass security rules.
 *
 * Usage:
 *   node scripts/firestore-seed.mjs                     # seed from emulator-data/seed.json
 *   node scripts/firestore-seed.mjs ./custom-path.json  # seed from custom path
 *
 * Prerequisites: Firestore emulator must be running on localhost:8080
 */

import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

const app = initializeApp({ projectId: "malenovska-305f8" });
const db = getFirestore(app);

const COLLECTIONS = ["events", "legends", "races", "participants", "galleries"];

const STORAGE_PROD_HOSTS = [
  "https://firebasestorage.googleapis.com",
  "https://storage.googleapis.com",
];
const STORAGE_EMULATOR_HOST = "http://localhost:9199";

const rewriteStorageUrl = (url) => {
  if (typeof url !== "string") return url;
  for (const host of STORAGE_PROD_HOSTS) {
    if (url.includes(host.replace("https://", ""))) {
      return url.replace(host, STORAGE_EMULATOR_HOST);
    }
  }
  // Also handle old bucket name in URLs (in case dump predates migration)
  if (url.includes("malenovska-305f8.appspot.com")) {
    return url.replace("malenovska-305f8.appspot.com", "malenovska-305f8");
  }
  return url;
};

const deserializeValue = (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val === "string") return rewriteStorageUrl(val);
  if (val?.__type === "timestamp") {
    return new Timestamp(val.seconds, val.nanoseconds);
  }
  if (Array.isArray(val)) return val.map(deserializeValue);
  if (typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, deserializeValue(v)])
    );
  }
  return val;
};

const seedCollection = async (name, docs) => {
  const ids = Object.keys(docs);
  if (ids.length === 0) return;

  console.log(`  Seeding ${name} (${ids.length} docs)...`);

  // Admin SDK batches support max 500 ops
  for (let i = 0; i < ids.length; i += 450) {
    const batch = db.batch();
    const chunk = ids.slice(i, i + 450);
    for (const id of chunk) {
      batch.set(db.doc(`${name}/${id}`), deserializeValue(docs[id]));
    }
    await batch.commit();
  }
};

const seedParticipantPrivate = async (subs) => {
  const pids = Object.keys(subs);
  if (pids.length === 0) return;

  const ops = [];
  for (const pid of pids) {
    const subDocs = subs[pid];
    for (const [docId, data] of Object.entries(subDocs)) {
      ops.push({ path: `participants/${pid}/private/${docId}`, data });
    }
  }

  console.log(`  Seeding participants/*/private (${ops.length} docs)...`);

  for (let i = 0; i < ops.length; i += 450) {
    const batch = db.batch();
    for (const op of ops.slice(i, i + 450)) {
      batch.set(db.doc(op.path), deserializeValue(op.data));
    }
    await batch.commit();
  }
};

const EMULATOR_HOST = "localhost:8080";
const PROJECT_ID = "malenovska-305f8";

const setBackgroundTriggers = async (enabled) => {
  const action = enabled ? "enableBackgroundTriggers" : "disableBackgroundTriggers";
  try {
    const res = await fetch(
      `http://${EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/${action}`,
      { method: "PUT" },
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    console.log(`  Background triggers ${enabled ? "enabled" : "disabled"}.`);
  } catch {
    console.warn(`  Could not ${action} (functions emulator may not be running).`);
  }
};

const main = async () => {
  const seedPath = process.argv[2] || "emulator-data/seed.json";

  let data;
  try {
    data = JSON.parse(readFileSync(seedPath, "utf-8"));
  } catch (err) {
    console.error(`Failed to read ${seedPath}:`, err.message);
    console.error("Run 'npm run emulators:dump' first to create the dump.");
    process.exit(1);
  }

  console.log(`Seeding emulator from ${seedPath} (exported ${data.__exportedAt})...\n`);

  await setBackgroundTriggers(false);

  for (const name of COLLECTIONS) {
    if (data[name]) await seedCollection(name, data[name]);
  }

  if (data.config?.config) {
    console.log("  Seeding config...");
    const batch = db.batch();
    batch.set(db.doc("config/config"), deserializeValue(data.config.config));
    await batch.commit();
  }

  if (data._participantPrivate) {
    await seedParticipantPrivate(data._participantPrivate);
  }

  // Create test admin user
  const email = "admin@malenovska.cz";
  const password = "admin123";
  const auth = getAuth(app);
  try {
    await auth.createUser({ email, password, displayName: "Test Admin" });
    console.log(`\n  Admin user created: ${email} / ${password}`);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      console.log(`\n  Admin user already exists: ${email}`);
    } else {
      throw err;
    }
  }

  await setBackgroundTriggers(true);

  console.log("\nDone! Emulator is seeded.");
  process.exit(0);
};

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
