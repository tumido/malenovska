import * as React from "react";
import { Admin, Resource, Login } from "react-admin";
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Helmet } from "react-helmet";

import {
  Today,
  Receipt,
  Group,
  Person,
  CameraEnhance,
} from "@material-ui/icons";

import "@firebase/auth";

import { adminTheme } from "./utilities/theme";
import { czechMessages } from "./utilities/i18n";
import { deleteParticipantSubCollection } from "./utilities/sagas";
import BgImage from "@malenovska/common/assets/images/background.jpg";
import Favicon from "@malenovska/common/assets/images/favicon-32x32.png";
import { firebaseConfig } from "@malenovska/common/utilities/firebase";

import legend from "containers/Legend";
import event from "containers/Event";
import race from "containers/Race";
import config from "containers/Config";
import Dashboard from "containers/Dashboard";
import participant from "containers/Participant";
import gallery from "containers/Gallery";

const options = {};

const dataProvider = FirebaseDataProvider(firebaseConfig, options); // eslint-disable-line
const authProvider = FirebaseAuthProvider(firebaseConfig, options); // eslint-disable-line
const i18nProvider = polyglotI18nProvider(() => czechMessages, "cs");

const LoginPage = () => <Login backgroundImage={BgImage} />;

const App = () => (
  <React.Fragment>
    <Helmet defaultTitle="🛡️ Malenovská Strojovna">
      <meta name="theme-color" content="#0e0a0a" />
      <link rel="shortcut icon" href={Favicon} />
    </Helmet>
    <Admin
      locale="cs"
      i18nProvider={i18nProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={adminTheme}
      loginPage={LoginPage}
      title="Malenovská Strojovna"
      customSagas={[deleteParticipantSubCollection]}
      disableTelemetry
      dashboard={Dashboard}
    >
      <Resource name="config" {...config} />
      <Resource
        name="events"
        options={{ label: "Události" }}
        icon={Today}
        {...event}
      />
      <Resource
        name="legends"
        options={{ label: "Legendy a příběhy" }}
        icon={Receipt}
        {...legend}
      />
      <Resource
        name="races"
        options={{ label: "Strany" }}
        icon={Group}
        {...race}
      />
      <Resource
        name="participants"
        options={{ label: "Účastníci" }}
        icon={Person}
        {...participant}
      />
      <Resource
        name="galleries"
        options={{ label: "Galerie" }}
        icon={CameraEnhance}
        {...gallery}
      />
    </Admin>
  </React.Fragment>
);

export default App;
