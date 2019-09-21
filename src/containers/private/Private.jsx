import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import czechMessages from 'ra-language-czech';

import admin from 'utilities/firebase_admin';
import legend from './Legend';

const messages = {
  cs: czechMessages
};

const Private = () => (
  <Admin
    locale='cs'
    i18nProvider={ locale => messages[locale] }
    dataProvider={ admin.dataProvider }
    authProvider={ admin.authProvider }
    customSagas={ [ admin.firebaseRealtime ] }
  >
    <Resource name='legends'
      options={ { label: 'Legendy a příběhy' } }
      list={ legend.List }
      // show={ legend.Show }
      create={ legend.Create }
      edit={ legend.Edit }
    />
  </Admin>
);

export default Private;
