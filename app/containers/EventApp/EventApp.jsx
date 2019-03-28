/**
 *
 * EventApp
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';

import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LegendsPage from 'containers/LegendsPage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import InfoPage from 'containers/InfoPage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { setEvent } from './actions';

const EventApp = ({ match, events, setEvent }) => {
  setEvent(match.url, 2019)
  return (
    <div>
      {/* <Helmet>
        <title>{event}</title>
      </Helmet> */}
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
  )
}

const mapDispatchToProps = (dispatch) => ({
  setEvent: (event, year) => { dispatch(setEvent(event, year)) }
})

const mapStateToProps = (state) => ({
  events: state.firestore.data.events,
})

export default compose(
  firestoreConnect([{collection: 'events'}]),
  connect(mapStateToProps, mapDispatchToProps),
)(EventApp)
