import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

// Import root app
import App from 'containers/App';

// Import CSS reset and Global Styles
import './styles/theme.scss';

import configureStore from './configureStore';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});
const amaticObserver = new FontFaceObserver('Amatic SC', { weight: 700 });

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('openSansLoaded');
}, () => {
  document.body.classList.remove('openSansLoaded');
});

amaticObserver.load().then(() => {
  document.body.classList.add('amaticLoaded');
}, () => {
  document.body.classList.remove('amaticLoaded');
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState);
const MOUNT_NODE = document.getElementById('app');

// Configure Firestore and Firebase
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

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

firebase.initializeApp(firebaseConfig);

const render = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <ReactReduxFirebaseProvider { ...rrfProps }>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Enable data persistance only if in devel mode
  firebase.firestore().enablePersistence().catch(err => {
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
  });
}

render();
