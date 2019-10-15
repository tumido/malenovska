import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import czechMessages from 'ra-language-czech';
import { Today, Receipt, Group } from '@material-ui/icons';

import admin from 'utilities/firebase_admin';
import legend from './Legend';
import event from './Event';
import race from './Race';
import { adminTheme } from 'utilities/theme';

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
    theme={ adminTheme }
  >
    <Resource
      name='events'
      options={ { label: 'Události' } }
      icon={ Today }
      list={ event.List }
      // show={ legend.Show }
      create={ event.Create }
      edit={ event.Edit }
    />
    <Resource
      name='legends'
      options={ { label: 'Legendy a příběhy' } }
      icon={ Receipt }
      list={ legend.List }
      // show={ legend.Show }
      create={ legend.Create }
      edit={ legend.Edit }
    />
    <Resource
      name='races'
      options={ { label: 'Strany' } }
      icon={ Group }
      list={ race.List }
      // show={ race.Show }
      create={ race.Create }
      edit={ race.Edit }
    />
    <Resource
      name='participants'
    />
  </Admin>
);

export default Private;
