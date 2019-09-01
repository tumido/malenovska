import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import { setEvent } from './redux/actions';

import LandingPage from 'containers/LandingPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LegendsPage from 'containers/LegendsPage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import InfoPage from 'containers/InfoPage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import LoadingIndicator from 'components/LoadingIndicator';

import { defaultThemeColor } from 'styles/theme.scss';

class BaseEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.setEvent(this.props.event.id);
  };

  render() {
    let { event } = this.props;

    return (
      <div>
        <Header event={ event } />
        <Switch>
          <Route path={ `/${event.id}/legends` } component={ LegendsPage } />
          <Route path={ `/${event.id}/rules` } component={ RulesPage } />
          <Route path={ `/${event.id}/info` } component={ InfoPage } />
          <Route path={ `/${event.id}/registration` } component={ RegistrationPage } />
          <Route component={ NotFoundPage } />
        </Switch>
        <Footer />
      </div>
    );
  };
}

BaseEvent.propTypes = {
  event: PropTypes.object,
  setEvent: PropTypes.func
};

const Event = connect(null, { setEvent })(BaseEvent);

const App = ({ events }) => {
  if (!isLoaded(events)) {
    return <LoadingIndicator />;
  }

  return (
    <div id="app-wrapper">
      <Helmet defaultTitle={ `Malenovská ${ new Date().getFullYear()}` }>
        <meta name="theme-color" content={ defaultThemeColor } />
      </Helmet>
      <Switch>
        { isLoaded(events) && events.map((event) => (
          <Route
            key={ `route_${event.id}` }
            path={ '/' + event.id }
            render={ (props) => <Event { ...props } event={ event }/> }
          />
        ))}
        <Route exact path='/' component={ LandingPage } />
      </Switch>
    </div>
  )
};

App.propTypes = {
  events: PropTypes.array
};

export default compose(
  firestoreConnect(() => ([
    { collection: 'events' }
  ])),
  connect(state => ({
    events: state.firestore.ordered.events
  }))
)(App);
