import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2tOrkBzA0YcYT63KFtmtHFnwp6tAuuFI",
  authDomain: "malenovska-305f8.firebaseapp.com",
  databaseURL: "https://malenovska-305f8.firebaseio.com",
  projectId: "malenovska-305f8",
  storageBucket: "malenovska-305f8.appspot.com",
  messagingSenderId: "189984929418",
};

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with persistent cache (skip in emulator mode — no need for offline cache)
if (getApps().length <= 1) {
  try {
    initializeFirestore(app, useEmulators ? {} : {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    // Firestore already initialized
  }
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connect to emulators in dev mode (guard against HMR re-execution)
const g = globalThis as unknown as { _emulatorsConnected?: boolean };
if (useEmulators && !g._emulatorsConnected) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "localhost", 9199);
  g._emulatorsConnected = true;
}

export default app;
