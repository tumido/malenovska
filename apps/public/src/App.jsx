import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import { getFirestore, collection, doc } from 'firebase/firestore';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import { CssBaseline, NoSsr, ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";

import BgImage from "@malenovska/common/assets/images/background.jpg";
import DefaultOgImage from "@malenovska/common/assets/images/og_image.jpg";

import { Loading } from "./components";
import { theme } from "./utilities/theme";

const NotFound = lazy(() => import("./pages/404"));
const Landing = lazy(() => import("./pages/choose"));
const Public = lazy(() => import("./pages"));

const Div = styled('div')(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  minHeight: "100vh",
  [theme.breakpoints.up("sm")]: {
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
  },
}))

const ThemedLoading = () =>  (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Div>
      <Loading />
    </Div>
  </ThemeProvider>
);

const App = () => {
  const [events, eventsLoading, eventsError] = useCollectionData(collection(getFirestore(), 'events'));
  const [config, configLoading, configError] = useDocumentData(doc(getFirestore(), 'config', 'config'));

  if (eventsLoading || configLoading || eventsError || configError) {
    return <ThemedLoading />;
  }

  return (
    <NoSsr>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet
          defaultTitle={`Malenovská ${new Date().getFullYear()}`}
          titleTemplate={`Malenovská ${new Date().getFullYear()} - %s`}
          meta={[{ property: "og:image", content: DefaultOgImage }]}
        />
        <Suspense fallback={<ThemedLoading />}>
          <BrowserRouter>
            <Routes>
              {events.map((event) => (
                <Route key={`route_${event.id}`} path={`/${event.id}/*`} element={<Public event={event} />} />
              ))}
              <Route path="/" element={<Navigate to={`/${config.event}`} replace />} />
              <Route path="/choose" element={<Landing />} />
              <Route path="*" element={<Div><NotFound /></Div>} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ThemeProvider>
    </NoSsr>
  );
};

export default App;
