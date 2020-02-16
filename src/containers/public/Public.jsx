import React, { lazy } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { SnackbarProvider } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';

import { Header, Footer, Loading, Notifier, ScrollRestore } from 'components';
import { setEvent } from 'utilities/redux/actions/event-actions';

import BgImage from 'assets/images/background.jpg';

const LegendList = lazy(() => import('containers/public/Legend/List'));
const LegendShow = lazy(() => import('containers/public/Legend/Show'));
const Rules = lazy(() => import('containers/public/Rules'));
const Info = lazy(() => import('containers/public/Info'));
const Contact = lazy(() => import('containers/public/Contact'));
const Races = lazy(() => import('containers/public/Races'));
const RegistrationNew = lazy(() => import('containers/public/Registration/New'));
const RegistrationDone = lazy(() => import('containers/public/Registration/Done'));
const RegistrationList = lazy(() => import('containers/public/Registration/List'));

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
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: '64px'
    },
    '& main': {
      flexGrow: 1
    }
  }
}));

const Public = ({ event, setEvent }) => {
  const classes = useStyles();
  React.useEffect(() => { setEvent(event); });

  useFirestoreConnect(() => ([{ collection: 'events' }]));
  const allEvents = useSelector(({ firestore }) => firestore.ordered.events);

  if (!isLoaded(allEvents) || !event) {
    return (
      <div className={ classes.content }>
        <Loading />
      </div>
    );
  }

  const navigation = [
    [
      {
        title: 'Legendy a příběhy',
        icon: 'receipt',
        href: 'legends'
      },
      {
        title: 'Pravidla',
        icon: 'gavel',
        href: 'rules'
      },
      {
        title: 'Svět',
        icon: 'map'
      },
      {
        title: 'Bojující strany',
        icon: 'group',
        href: 'races'
      },
      {
        title: 'Důležité informace',
        icon: 'location_on',
        href: 'info'
      },
      {
        title: 'Kontakty',
        icon: 'mail_outline',
        href: 'contacts'
      },
      {
        title: 'Galerie',
        className: 'material-icons-outlined',
        icon: 'collections_outline'
      }
    ],
    [
      {
        title: 'Nová registrace',
        icon: 'person_add',
        href: 'registration/new',
        disabled: !event.registrationAvailable
      },
      {
        title: 'Účastníci',
        icon: 'how_to_reg',
        href: 'registration/list'
      }
    ]
  ];

  return (
    <ScrollRestore>
      <SnackbarProvider>
        <div className={ classes.root }>
          <Helmet><title>{ `${event.name} ${event.year}` }</title></Helmet>
          <Header event={ event } allEvents={ allEvents } navigation={ navigation }/>
          <div className={ classes.content }>
            <div id='top' />
            <main>
              <Switch>
                <Route path={ `/${event.id}/legends/:id` } component={ LegendShow } />
                <Route path={ `/${event.id}/legends` } component={ LegendList } />
                <Route path={ `/${event.id}/rules` } component={ Rules } />
                <Route path={ `/${event.id}/info` } component={ Info } />
                <Route path={ `/${event.id}/contacts` } component={ Contact } />
                <Route path={ `/${event.id}/races` } component={ Races } />
                <Route path={ `/${event.id}/registration/new` } component={ RegistrationNew } />
                <Route path={ `/${event.id}/registration/done` } component={ RegistrationDone } />
                <Route path={ `/${event.id}/registration/list` } component={ RegistrationList } />
                <Redirect exact from={ `/${event.id}` } to={ `/${event.id}/legends` } />
                <Redirect to='/not-found' />
              </Switch>
            </main>
            <Footer />
            <Notifier />
          </div>
        </div>
      </SnackbarProvider>
    </ScrollRestore>
  );
};

Public.propTypes = {
  event: PropTypes.object,
  setEvent: PropTypes.func
};

export default connect(null, { setEvent })(Public);
