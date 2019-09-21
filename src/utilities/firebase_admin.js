import { FirebaseAuthProvider, FirebaseDataProvider, FirebaseRealTimeSaga } from 'react-admin-firebase';
import { firebaseConfig } from './firebase';
import '@firebase/auth';

const options = {};

/* eslint-disable new-cap */
export const dataProvider = FirebaseDataProvider(firebaseConfig, options);
export const authProvider = FirebaseAuthProvider(firebaseConfig, options);
export const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);
/* eslint-enable */

export default { dataProvider, authProvider, firebaseRealtime };
