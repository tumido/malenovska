import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
import { CssBaseline, NoSsr } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

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

smoothscroll.polyfill();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: '#000'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) top center no-repeat`,
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      marginTop: '64px'
    },
    '& main': {
      flexGrow: 1
    }
  }
}));

const BaseEvent = ({ event, allEvents, setEvent }) => {
  React.useEffect(() => { setEvent(event.id); });

  const classes = useStyles();
  return (
    <div className={ classes.root }>
      <Helmet><title>{ `${event.name} ${event.year}` }</title></Helmet>
      <Header event={ event } allEvents={ allEvents }/>
      <div className={ classes.content }>
        <main>
          <Switch>
            <Route path={ `/${event.id}/legends/:id` } render={ (props) => <LegendDetailPage { ...props } event={ event }/> } />
            <Route path={ `/${event.id}/legends` } render={ (props) => <LegendsPage { ...props } event={ event }/> } />
            <Route path={ `/${event.id}/rules` } render={ (props) => <RulesPage { ...props } event={ event }/> } />
            <Route path={ `/${event.id}/info` } render={ (props) => <InfoPage { ...props } event={ event }/> }  />
            <Route path={ `/${event.id}/registration` } component={ RegistrationPage } />
            <Redirect exact from={ `/${event.id}` } to={ `/${event.id}/legends` } />
            <Redirect to='/not-found' />
          </Switch>
        </main>
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
