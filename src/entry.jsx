import 'whatwg-fetch';
import('smoothscroll-polyfill').then(() => smoothscroll.polyfill());

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import { configureStore } from './utilities/store';
import { rrfProps, enableFirebasePersistence, initializeFirebase } from './utilities/firebase';
import loadFonts from './utilities/fonts';
import App from 'App';

initializeFirebase();
loadFonts();

const store = configureStore();

const render = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <ReactReduxFirebaseProvider { ...rrfProps(store) }>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>,
    document.getElementById('app')
  );
};

if (module.hot) {
  enableFirebasePersistence();
}

render();
