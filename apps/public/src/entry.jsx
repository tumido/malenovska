// Polyfills
import 'whatwg-fetch';
import('smoothscroll-polyfill').then(smoothscroll => smoothscroll.polyfill());

import React from 'react';
import { createRoot } from 'react-dom/client';

import loadFonts from '@malenovska/common/utilities/fonts';

import { enableFirebasePersistence, initializeFirebase } from './utilities/firebase';
import App from './App';

initializeFirebase();
loadFonts();

const IE = /MSIE|Trident/.test(navigator.userAgent);

const render = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
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
