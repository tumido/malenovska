// Polyfills
import 'whatwg-fetch';
import('smoothscroll-polyfill').then(smoothscroll => smoothscroll.polyfill());

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import { configureStore } from 'common/utilities/store';
import { rrfProps, enableFirebasePersistence, initializeFirebase } from 'common/utilities/firebase';
import loadFonts from 'common/utilities/fonts';
import App from './App';

initializeFirebase();
loadFonts();

const store = configureStore();

const IE = process.browser && /MSIE|Trident/.test(navigator.userAgent);

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
  if (IE) {
    alert(`
      Internet Explorer není podporován. Stránka se nemusí správně zobrazit.
      Použijte prosím cokoliv normálního. Například Firefox, Chrome či Edge.
    `);
  }
};

if (module.hot) {
  enableFirebasePersistence();
}

render();
