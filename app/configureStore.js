/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

const sagaMiddleware = createSagaMiddleware();

// Configure Firestore and Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2tOrkBzA0YcYT63KFtmtHFnwp6tAuuFI",
  authDomain: "malenovska-305f8.firebaseapp.com",
  databaseURL: "https://malenovska-305f8.firebaseio.com",
  projectId: "malenovska-305f8",
  storageBucket: "malenovska-305f8.appspot.com",
  messagingSenderId: "189984929418"
}
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  const enhancers = [
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase),
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
      store.dispatch({ type: '@@REDUCER_INJECTED' });
    });
  }

  return store;
}
