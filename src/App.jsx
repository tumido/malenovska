import React, { lazy, Suspense } from 'react';
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

import { Header, Footer, Loading } from 'components';

import { setEvent } from 'redux/actions/event-actions';
import { theme } from 'utilities/theme';

import BgImage from 'assets/images/background.jpg';

const NotFound = lazy(() => import('containers/NotFound'));
const Landing = lazy(() => import('containers/public/Landing'));
const LegendList = lazy(() => import('containers/public/Legend/List'));
const LegendShow = lazy(() => import('containers/public/Legend/Show'));
const Rules = lazy(() => import('containers/public/Rules'));
const Info = lazy(() => import('containers/public/Info'));
const RegistrationNew = lazy(() => import('containers/public/Registration/New'));
const RegistrationList = lazy(() => import('containers/public/Registration/List'));
const Contact = lazy(() => import('containers/public/Contact/List'));

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
  React.useEffect(() => { setEvent(event); });

  const classes = useStyles();
  return (
    <div className={ classes.root }>
      <Helmet><title>{ `${event.name} ${event.year}` }</title></Helmet>
      <Header event={ event } allEvents={ allEvents }/>
      <div className={ classes.content }>
        <main>
          <Switch>
            <Route path={ `/${event.id}/legends/:id` } component={ LegendShow } />
            <Route path={ `/${event.id}/legends` } component={ LegendList } />
            <Route path={ `/${event.id}/rules` } component={ Rules } />
            <Route path={ `/${event.id}/info` } component={ Info } />
            <Route path={ `/${event.id}/contact` } component={ Contact } />
            <Route path={ `/${event.id}/registration/new` } component={ RegistrationNew } />
            <Route path={ `/${event.id}/registration/list` } component={ RegistrationList } />
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
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <div className={ classes.content }>
          <Loading />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <NoSsr>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <Helmet defaultTitle={ `Malenovská ${ new Date().getFullYear()}` }>
          <meta name="theme-color" content='#0e0a0a' />
        </Helmet>
        <Suspense fallback={ <Loading /> }>
          <Switch>
            { isLoaded(events) && events.map((event) => (
              <Route
                key={ `route_${event.id}` }
                path={ '/' + event.id }
                render={ (props) => <Event { ...props } event={ event }/> }
              />
            ))}
            <Route exact path='/' component={ Landing } />
            <Route component={ NotFound } />
          </Switch>
        </Suspense>
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
