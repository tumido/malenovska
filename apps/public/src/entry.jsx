// Polyfills
// import 'whatwg-fetch';
import('smoothscroll-polyfill').then(smoothscroll => smoothscroll.polyfill());

import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import loadFonts from '@malenovska/common/utilities/fonts';

import { configureStore } from './utilities/store';
import { rrfProps, enableFirebasePersistence, initializeFirebase } from './utilities/firebase';
import App from './App';

initializeFirebase();
loadFonts();

const store = configureStore();

const IE = process.browser && /MSIE|Trident/.test(navigator.userAgent);

const rootElement = document.getElementById('app');

const WrappedApp = () => {
  if (IE) {
    alert(`
      Internet Explorer není podporován. Stránka se nemusí správně zobrazit.
      Použijte prosím cokoliv normálního. Například Firefox, Chrome či Edge.
    `);
  }

  return (
    <Provider store={ store }>
      <ReactReduxFirebaseProvider { ...rrfProps(store) }>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

if (module.hot) {
  enableFirebasePersistence();
}

if (rootElement.hasChildNodes()) {
  hydrate(<WrappedApp />, rootElement);
} else {
  render(<WrappedApp />, rootElement);
}

render();
