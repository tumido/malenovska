import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  collection as firestoreCollection,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA2tOrkBzA0YcYT63KFtmtHFnwp6tAuuFI",
  authDomain: "malenovska-305f8.firebaseapp.com",
  databaseURL: "https://malenovska-305f8.firebaseio.com",
  projectId: "malenovska-305f8",
  storageBucket: "malenovska-305f8",
  messagingSenderId: "189984929418",
};

export const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with persistent cache (skip in emulator mode — no need for offline cache)
if (getApps().length <= 1) {
  try {
    initializeFirestore(
      app,
      useEmulators
        ? {}
        : {
            localCache: persistentLocalCache({
              tabManager: persistentMultipleTabManager(),
            }),
          },
    );
  } catch {
    // Firestore already initialized
  }
}

export const db = getFirestore(app);

// Connect Firestore emulator (auth & storage emulators are connected in their own modules)
const g = globalThis as unknown as { _firestoreEmulatorConnected?: boolean };
if (useEmulators && !g._firestoreEmulatorConnected) {
  connectFirestoreEmulator(db, "localhost", 8080);
  g._firestoreEmulatorConnected = true;
}

// Singleton converter — must be a stable reference so react-firebase-hooks'
// queryEqual check doesn't see a "new" query on every render.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const idConverter: FirestoreDataConverter<any> = {
  toFirestore: (data) => {
    const { id: _, ...rest } = data;
    return rest;
  },
  fromFirestore: (snap: QueryDocumentSnapshot) => ({
    ...snap.data(),
    id: snap.id,
  }),
};

export const typedCollection = <T extends { id: string }>(path: string) =>
  firestoreCollection(db, path).withConverter(
    idConverter as FirestoreDataConverter<T>,
  );

// Cloud Functions client
export const functions = getFunctions(app);

const gf = globalThis as unknown as { _functionsEmulatorConnected?: boolean };
if (useEmulators && !gf._functionsEmulatorConnected) {
  connectFunctionsEmulator(functions, "localhost", 5001);
  gf._functionsEmulatorConnected = true;
}

export default app;
