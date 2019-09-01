import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { reducer as burgerMenu } from 'redux-burger-menu';
import { reducer as formReducer } from 'redux-form';

import eventsReducer from './events';

export default (injectedReducers) => (
  combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    form: formReducer,
    events: eventsReducer,
    burgerMenu,
    ...injectedReducers
  })
);
