import * as React from 'react';
import { Admin, Resource, Login } from 'react-admin';
import { FirebaseAuthProvider, FirebaseDataProvider, FirebaseRealTimeSaga } from 'react-admin-firebase';
import czechMessages from 'ra-language-czech';

import { Today, Receipt, Group, Person } from '@material-ui/icons';

import '@firebase/auth';

import { adminTheme } from '@malenovska/common/utilities/theme';
import BgImage from '@malenovska/common/assets/images/background.jpg';
import { firebaseConfig } from '@malenovska/common/utilities/firebase';

import legend from 'containers/Legend';
import event from 'containers/Event';
import race from 'containers/Race';
import participant from 'containers/Participant';


const options = {};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = FirebaseAuthProvider(firebaseConfig, options);
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);

const messages = {
  cs: czechMessages
};

const LoginPage = () => <Login backgroundImage={ BgImage } />;

const Private = () => (
  <Admin
    locale='cs'
    i18nProvider={ locale => messages[locale] }
    dataProvider={ dataProvider }
    authProvider={ authProvider }
    customSagas={ [ firebaseRealtime ] }
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
