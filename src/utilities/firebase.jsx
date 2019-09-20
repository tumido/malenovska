import { createFirestoreInstance } from 'redux-firestore';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA2tOrkBzA0YcYT63KFtmtHFnwp6tAuuFI',
  authDomain: 'malenovska-305f8.firebaseapp.com',
  databaseURL: 'https://malenovska-305f8.firebaseio.com',
  projectId: 'malenovska-305f8',
  storageBucket: 'malenovska-305f8.appspot.com',
  messagingSenderId: '189984929418'
};

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

export const rrfProps = (store) => ({
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
});

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
};

/* eslint-disable no-console */
export const enableFirebasePersistence = () => (
  firebase.firestore().enablePersistence()
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
