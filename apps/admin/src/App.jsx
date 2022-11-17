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
} from "@mui/icons-material";
import { getStorage, ref, updateMetadata } from "firebase/storage";

import { adminTheme } from "./utilities/theme";
import { czechMessages } from "./utilities/i18n";
import BgImage from "@malenovska/common/assets/images/background.jpg";
import Favicon from "@malenovska/common/assets/images/favicon-32x32.png";
import { firebaseConfig } from "@malenovska/common/utilities/firebase";

import legend from "./containers/Legend";
import event from "./containers/Event";
import race from "./containers/Race";
import config from "./containers/Config";
import Dashboard from "./containers/Dashboard";
import participant from "./containers/Participant";
import gallery from "./containers/Gallery";

const options = {};

const dataProviderBase = FirebaseDataProvider(firebaseConfig, options);

const updateFileMetadata = (originalResponse, params) => {
  const storage = getStorage();
  Object.keys(params.data).map((k) => {
    if (
      !params.data[k]?.src?.startsWith("https://firebasestorage.googleapis.com")
    ) {
      return;
    }
    const url = new URL(params.data[k].src);
    const path = decodeURIComponent(
      url.pathname.slice(url.pathname.lastIndexOf("/") + 1)
    );
    const fileRef = ref(storage, path);

    updateMetadata(fileRef, { cacheControl: "public,max-age=31536000" });
  });

  return originalResponse;
};

const dataProvider = {
  ...dataProviderBase,
  delete: (resource, params) => {
    if (resource !== "participants") {
      return dataProviderBase.delete(resource, params);
    }
    return Promise.all([
      dataProviderBase.delete(resource, { id: `${params.id}/private/_` }),
      dataProviderBase.delete(resource, params),
    ]);
  },
  create: (resource, params) => {
    if (!["legends", "galleries", "events", "races"].includes(resource)) {
      return dataProviderBase.create(resource, params);
    }
    return dataProviderBase
      .create(resource, params)
      .then((r) => updateFileMetadata(r, params));
  },
  update: (resource, params) => {
    if (!["legends", "galleries", "events", "races"].includes(resource)) {
      return dataProviderBase.update(resource, params);
    }
    return dataProviderBase
      .update(resource, params)
      .then((r) => updateFileMetadata(r, params));
  },
};

const authProvider = FirebaseAuthProvider(firebaseConfig, options);
const i18nProvider = polyglotI18nProvider(() => czechMessages, "cs");

const LoginPage = () => <Login backgroundImage={BgImage} />;

const App = () => (
  <React.Fragment>
    <Helmet defaultTitle="🛡️ Malenovská Strojovna">
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
