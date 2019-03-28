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
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import EventApp from 'containers/EventApp';
import './style.scss';


const App = () => (
  <div id="app-wrapper">
    <Helmet
      titleTemplate={`Malenovská ${ new Date().getFullYear()} - %s`}
      defaultTitle={`Malenovská ${ new Date().getFullYear()}`}
    >
      <meta name="description" content="Malenovská je dřevárnou pro začátečníky i veterány" />
    </Helmet>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/bitva" component={EventApp} />
      <Route path="/sarvatka" component={EventApp} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
