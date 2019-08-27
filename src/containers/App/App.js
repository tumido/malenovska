/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import LandingPage from 'containers/LandingPage/Loadable';
import EventApp from 'containers/EventApp';
import styles from './style.scss';

const App = () => (
  <div id="app-wrapper">
    <Helmet
      defaultTitle={ `Malenovská ${ new Date().getFullYear()}` }
    >
      <meta name="theme-color" content={ styles.defaultThemeColor } />
    </Helmet>
    <Switch>
      <Route path="/bitva" component={ EventApp } />
      <Route path="/sarvatka" component={ EventApp } />
      <Route component={ LandingPage } />
    </Switch>
  </div>
);

export default App;
