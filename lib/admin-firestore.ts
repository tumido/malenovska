import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { getStorage, ref, updateMetadata } from "firebase/storage";
import { db } from "@/lib/firebase";
import type { FirestoreImage } from "@/lib/types";

/** Create a document with auto-timestamp */
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
) {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, {
    ...data,
    createdate: serverTimestamp(),
    lastupdate: serverTimestamp(),
  });
  await updateImageMetadata(data);
  return id;
}

/** Update a document with auto-timestamp */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    lastupdate: serverTimestamp(),
  });
  await updateImageMetadata(data);
}

/** Delete a document */
export async function removeDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

/** Delete a participant (main doc + private subcollection) */
export async function removeParticipant(id: string) {
  await Promise.all([
    deleteDoc(doc(db, "participants", id, "private", "_")),
    deleteDoc(doc(db, "participants", id)),
  ]);
}

/** Fetch a single document by ID */
export async function fetchDocument<T>(
  collectionName: string,
  id: string,
): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

/** Fetch participant private subcollection data */
export async function fetchParticipantPrivate(
  participantId: string,
): Promise<{ age?: number; email?: string } | null> {
  const snap = await getDoc(doc(db, "participants", participantId, "private", "_"));
  if (!snap.exists()) return null;
  return snap.data() as { age?: number; email?: string };
}

/** Query a collection with optional constraints */
export async function queryCollection<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}

/** Helper query builders */
export function byEvent(eventId: string) {
  return where("event", "==", eventId);
}

export function orderedBy(field: string, dir: "asc" | "desc" = "asc") {
  return orderBy(field, dir);
}

/** Set cache-control on Firebase Storage images after create/update */
async function updateImageMetadata(data: DocumentData) {
  const storage = getStorage();
  for (const value of Object.values(data)) {
    if (isFirestoreImage(value) && isStorageUrl(value.src)) {
      try {
        const path = extractStoragePath(value.src);
        const fileRef = ref(storage, path);
        await updateMetadata(fileRef, {
          cacheControl: "public,max-age=31536000",
        });
      } catch {
        // Ignore metadata update failures
      }
    }
  }
}

function isFirestoreImage(val: unknown): val is FirestoreImage {
  return val !== null && typeof val === "object" && "src" in val && typeof (val as FirestoreImage).src === "string";
}

function isStorageUrl(url: string): boolean {
  return url.includes("firebasestorage.googleapis.com");
}

function extractStoragePath(url: string): string {
  const match = url.match(/\/o\/(.+?)\?/);
  return match ? decodeURIComponent(match[1]) : "";
}
