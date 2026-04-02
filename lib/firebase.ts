import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2tOrkBzA0YcYT63KFtmtHFnwp6tAuuFI",
  authDomain: "malenovska-305f8.firebaseapp.com",
  databaseURL: "https://malenovska-305f8.firebaseio.com",
  projectId: "malenovska-305f8",
  storageBucket: "malenovska-305f8.appspot.com",
  messagingSenderId: "189984929418",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with persistent cache
if (getApps().length <= 1) {
  try {
    initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    // Firestore already initialized
  }
}

export const db = getFirestore(app);
export default app;
