import * as React from 'react';
import { Admin, Resource, Login } from 'react-admin';
import { FirebaseAuthProvider, FirebaseDataProvider } from 'react-admin-firebase';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { Today, Receipt, Group, Person } from '@material-ui/icons';

import '@firebase/auth';

import { adminTheme } from './utilities/theme';
import { czechMessages } from './utilities/i18n';
import BgImage from '@malenovska/common/assets/images/background.jpg';
import { firebaseConfig } from '@malenovska/common/utilities/firebase';

import legend from 'containers/Legend';
import event from 'containers/Event';
import race from 'containers/Race';
import participant from 'containers/Participant';


const options = {};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = FirebaseAuthProvider(firebaseConfig, options);
const i18nProvider = polyglotI18nProvider(() => czechMessages, 'cs');

const LoginPage = () => <Login backgroundImage={ BgImage } />;

const Private = () => (
  <Admin
    locale='cs'
    i18nProvider={ i18nProvider }
    dataProvider={ dataProvider }
    authProvider={ authProvider }
    theme={ adminTheme }
    loginPage={ LoginPage }
    title="Malenovská"
  >
    <Resource
      name='events'
      options={ { label: 'Události' } }
      icon={ Today }
      { ...event }
    />
    <Resource
      name='legends'
      options={ { label: 'Legendy a příběhy' } }
      icon={ Receipt }
      { ...legend }
    />
    <Resource
      name='races'
      options={ { label: 'Strany' } }
      icon={ Group }
      { ...race }
    />
    <Resource
      name='participants'
      options={ { label: 'Účastníci' } }
      icon={ Person }
      { ...participant }
    />
  </Admin>
);

export default Private;
