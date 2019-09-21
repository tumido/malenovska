import * as React from 'react';
import { Admin, Resource } from 'react-admin';

import admin from 'utilities/firebase_admin';

const Private = () => (
  <Admin
    dataProvider={ admin.dataProvider }
    authProvider={ admin.authProvider }
    customSagas={ [ admin.firebaseRealtime ] }
  >
  </Admin>
);

export default Private;
