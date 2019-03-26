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
import LegendsPage from 'containers/LegendsPage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import InfoPage from 'containers/InfoPage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import './style.scss';

const EventRouter = ({ match }) => (
  <div>
    <Helmet
      titleTemplate="Malenovská 2019 - %s"
      defaultTitle="Malenovská Pleskna 2018"
    >
      <meta name="description" content="Malenovská je dřevárnou pro začátečníky i veterány" />
    </Helmet>
    <Route component={Header} />
    <div id="app-content">
      <Switch>
        <Route path={match.url + "/legends"} component={LegendsPage} />
        <Route path={match.url + "/rules"} component={RulesPage} />
        <Route path={match.url + "/info"} component={InfoPage} />
        <Route path={match.url + "/registration"} component={RegistrationPage} />
        <Route component={NotFoundPage} />
      </Switch>
    <Route component={Footer} />
    </div>
  </div>
);

const App = () => (
  <div id="app-wrapper">
    <Helmet
      titleTemplate="Malenovská - %s"
      defaultTitle="Malenovská Pleskna 2018"
    >
      <meta name="description" content="Malenovská je dřevárnou pro začátečníky i veterány" />
    </Helmet>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/bitva" component={EventRouter} />
      <Route path="/sarvatka" component={EventRouter} />
    </Switch>
  </div>
);

export default App;
