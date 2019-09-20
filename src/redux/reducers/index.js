import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { reducer as formReducer } from 'redux-form';

import eventReducer from './event';
import mapReducer from './map';
import patricipantReducer from './participant';

export default (injectedReducers) => (
  combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    form: formReducer,
    event: eventReducer,
    map: mapReducer,
    participant: patricipantReducer,
    ...injectedReducers
  })
);
