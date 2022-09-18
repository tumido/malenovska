// Polyfills
import 'whatwg-fetch';
import('smoothscroll-polyfill').then(smoothscroll => smoothscroll.polyfill());

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import loadFonts from '@malenovska/common/utilities/fonts';

import { getStore } from './utilities/store';
import { rrfProps, enableFirebasePersistence, initializeFirebase } from './utilities/firebase';
import App from './App';

initializeFirebase();
loadFonts();

const store = getStore();

const IE = /MSIE|Trident/.test(navigator.userAgent);

const render = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(
    <Provider store={ store }>
      <ReactReduxFirebaseProvider { ...rrfProps(store) }>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
  if (IE) {
    alert(`
      Internet Explorer není podporován. Stránka se nemusí správně zobrazit.
      Použijte prosím cokoliv normálního. Například Firefox, Chrome či Edge.
    `);
  }
};

if (module.hot) {
  module.hot.accept();
  enableFirebasePersistence();
}

render();
