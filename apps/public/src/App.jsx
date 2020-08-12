import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CssBaseline, NoSsr } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import BgImage from '@malenovska/common/assets/images/background.jpg';

import { Loading } from 'components';
import { theme } from './utilities/theme';

const NotFound = lazy(() => import('containers/NotFound'));
const Landing = lazy(() => import('containers/Landing'));
const Public = lazy(() => import('containers/Public'));

const useStyles = makeStyles(() => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center fixed`,
    minHeight: '100vh'
  }
}));

const ThemedLoading = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <div className={ classes.content }>
        <Loading />
      </div>
    </ThemeProvider>
  );
};

const App = () => {
  useFirestoreConnect(() => ([{ collection: 'events' }]));
  const events = useSelector(({ firestore }) => firestore.ordered.events);

  if (!isLoaded(events)) {
    return <ThemedLoading />;
  }

  return (
    <NoSsr>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <Helmet defaultTitle={ `Malenovská ${ new Date().getFullYear()}` }>
          <meta name="theme-color" content='#0e0a0a' />
        </Helmet>
        <Suspense fallback={ <ThemedLoading /> }>
          <Switch>
            { isLoaded(events) && events.map((event) => (
              <Route
                key={ `route_${event.id}` }
                path={ '/' + event.id }
                render={ (props) => <Public { ...props } event={ event }/> }
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

export default App;
