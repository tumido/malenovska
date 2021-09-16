import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import participant from './participant';
import notify from './notify';

export default (injectedReducers) => (
  combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    participant,
    notify,
    ...injectedReducers
  })
);
