import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
import { CssBaseline, NoSsr, makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import LandingPage from 'containers/LandingPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LegendsPage from 'containers/LegendsPage/Loadable';
import LegendDetailPage from 'containers/LegendDetailPage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import InfoPage from 'containers/InfoPage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import { Header, Footer, Loading } from 'components';

import { setEvent } from './redux/actions';
import { MalenovskaTheme } from './utilities/theme';

import BgImage from '../assets/images/background.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: '#000'
  },
  content: {
    flexGrow: 1,
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) top center no-repeat`,
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      marginTop: '64px'
    }
  }
}));

const BaseEvent = ({ event, allEvents, setEvent }) => {
  React.useEffect(() => { setEvent(event.id); });

  const classes = useStyles();
  return (
    <div className={ classes.root }>
      <Header event={ event } allEvents={ allEvents }/>
      <div className={ classes.content }>
        <Switch>
          <Route path={ `/${event.id}/legends/:id` } render={ (props) => <LegendDetailPage { ...props } event={ event }/> } />
          <Route path={ `/${event.id}/legends` } render={ (props) => <LegendsPage { ...props } event={ event }/> } />
          <Route path={ `/${event.id}/rules` } component={ RulesPage } />
          <Route path={ `/${event.id}/info` } component={ InfoPage } />
          <Route path={ `/${event.id}/registration` } component={ RegistrationPage } />
          <Redirect exact from={ `/${event.id}` } to={ `/${event.id}/legends` } />
        </Switch>
        <Footer />
      </div>
    </div>
  );
};

BaseEvent.propTypes = {
  event: PropTypes.object,
  setEvent: PropTypes.func,
  allEvents: PropTypes.array
};

const Event = connect(
  state => ({
    allEvents: state.firestore.ordered.events
  }),
  { setEvent }
)(BaseEvent);

const App = ({ events }) => {
  const classes = useStyles();

  if (!isLoaded(events)) {
    return (
      <ThemeProvider theme={ MalenovskaTheme }>
        <CssBaseline />
        <div className={ classes.content }>
          <Loading />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <NoSsr>
      <ThemeProvider theme={ MalenovskaTheme }>
        <CssBaseline />
        <Helmet defaultTitle={ `Malenovská ${ new Date().getFullYear()}` }>
          <meta name="theme-color" content='#0e0a0a' />
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
          <Route component={ NotFoundPage } />
        </Switch>
      </ThemeProvider>
    </NoSsr>
  );
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
