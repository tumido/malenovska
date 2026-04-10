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
import { getStorage, connectStorageEmulator, ref, updateMetadata, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app, { db, useEmulators } from "@/lib/firebase";
import type { FirestoreImage } from "@/lib/types";

const storage = getStorage(app);

const g = globalThis as unknown as { _storageEmulatorConnected?: boolean };
if (useEmulators && !g._storageEmulatorConnected) {
  connectStorageEmulator(storage, "localhost", 9199);
  g._storageEmulatorConnected = true;
}

/** Create a document with auto-timestamp */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
) => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, {
    ...data,
    createdate: serverTimestamp(),
    lastupdate: serverTimestamp(),
  });
  await updateImageMetadata(data);
  return id;
};

/** Update a document with auto-timestamp */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    lastupdate: serverTimestamp(),
  });
  await updateImageMetadata(data);
};

/** Delete a document */
export const removeDocument = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};

/** Delete a participant (main doc + private subcollection) */
export const removeParticipant = async (id: string) => {
  await Promise.all([
    deleteDoc(doc(db, "participants", id, "private", "_")),
    deleteDoc(doc(db, "participants", id)),
  ]);
};

/** Fetch a single document by ID */
export const fetchDocument = async <T>(
  collectionName: string,
  id: string,
): Promise<(T & { id: string }) | null> => {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
};

/** Fetch participant private subcollection data */
export const fetchParticipantPrivate = async (
  participantId: string,
): Promise<{ age?: number; email?: string } | null> => {
  const snap = await getDoc(doc(db, "participants", participantId, "private", "_"));
  if (!snap.exists()) return null;
  return snap.data() as { age?: number; email?: string };
};

/** Query a collection with optional constraints */
export const queryCollection = async <T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
};

/** Helper query builders */
export const byEvent = (eventId: string) => {
  return where("event", "==", eventId);
};

export const orderedBy = (field: string, dir: "asc" | "desc" = "asc") => {
  return orderBy(field, dir);
};

/** Upload a file to Firebase Storage, returns download URL */
const uploadFile = async (file: File, path?: string): Promise<string> => {
  const storagePath = path ?? `admin-uploads/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, storagePath);
  const task = uploadBytesResumable(fileRef, file);
  await task;
  return getDownloadURL(task.snapshot.ref);
};

/** Pending file uploads — keyed by blob URL */
const pendingFiles = new Map<string, File>();

/** Register a local file for deferred upload. Returns a blob URL for preview. */
export const registerPendingUpload = (file: File): string => {
  const blobUrl = URL.createObjectURL(file);
  pendingFiles.set(blobUrl, file);
  return blobUrl;
};

/** Walk form data, upload any pending blob URLs, return cleaned data. */
export const processPendingUploads = async <T extends DocumentData>(data: T): Promise<T> => {
  if (pendingFiles.size === 0) return data;

  const result = { ...data };
  for (const [key, value] of Object.entries(result)) {
    if (value && typeof value === "object" && "src" in value) {
      const src = (value as { src: string }).src;
      const file = pendingFiles.get(src);
      if (file) {
        const url = await uploadFile(file);
        (result as Record<string, unknown>)[key] = { ...value, src: url };
        pendingFiles.delete(src);
        URL.revokeObjectURL(src);
      }
    }
  }
  return result;
};

/** Set cache-control on Firebase Storage images after create/update */
const updateImageMetadata = async (data: DocumentData) => {
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
};

const isFirestoreImage = (val: unknown): val is FirestoreImage => {
  return val !== null && typeof val === "object" && "src" in val && typeof (val as FirestoreImage).src === "string";
};

const isStorageUrl = (url: string): boolean => {
  return url.includes("firebasestorage.googleapis.com") || url.includes("storage.googleapis.com");
};

const extractStoragePath = (url: string): string => {
  // firebasestorage.googleapis.com format: /v0/b/BUCKET/o/PATH?...
  const firebaseMatch = url.match(/\/o\/(.+?)\?/);
  if (firebaseMatch) return decodeURIComponent(firebaseMatch[1]);
  // storage.googleapis.com format: /BUCKET/PATH
  const gcsMatch = url.match(/storage\.googleapis\.com\/[^/]+\/(.+?)(\?|$)/);
  if (gcsMatch) return decodeURIComponent(gcsMatch[1]);
  return "";
};
