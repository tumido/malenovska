import { getApps, initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { firebaseConfig } from '@malenovska/common/utilities/firebase';

export const initializeFirebase = () => {
  if (getApps().length < 1) {
    const app = initializeApp(firebaseConfig);
    getFirestore(app)
  }
};

/* eslint-disable no-console */
export const enableFirebasePersistence = () => (
  enableIndexedDbPersistence(getFirestore())
  .then(() => {
    console.log('Firestore offline access and persistance enabled.');
  })
  .catch(err => {
    let reason = (c => {
      switch (c) {
        case 'failed-precondition':
          return 'Another tab active';
        case 'unimplemented':
          return 'Missing support in your browser';
        default:
          return `Other: ${c}`;
      }
    })(err.code);

    console.log(`Unable to initialize offline storage, reason: ${reason}`);
  })
);
/* eslint-enable no-console */

export const timestampToDateStr = timestamp => timestamp.toDate().toLocaleDateString('cs-CZ');
export const timestampToTimeStr = timestamp => timestamp.toDate().toLocaleTimeString(
  [], { hour: '2-digit', minute: '2-digit', hour12: false }
);
