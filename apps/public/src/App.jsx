import React, { lazy, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import { getFirestore, collection, doc, query } from 'firebase/firestore';
import { useQueryData, useDocumentData } from 'react-firehooks/firestore';

import { CssBaseline, NoSsr, ThemeProvider } from "@mui/material";

import DefaultOgImage from "@malenovska/common/assets/images/og_image.jpg";

import { theme } from "./utilities/theme";
import { ThemedLoading, Div } from "./components/ThemedLoading";
import { TopBannerProvider, useTopBanner } from "./contexts/TopBannerContext";

const NotFound = lazy(() => import("./pages/404"));
const Landing = lazy(() => import("./pages/choose"));
const Public = lazy(() => import("./pages"));

const DevBanner = () => {
  const { setTopBanner } = useTopBanner();

  useEffect(() => {
    if (DEVELOPMENT === true) {
      setTopBanner("DEVELOPMENT");
    }
  }, [])

  return null
}

const App = () => {
  const [events, eventsLoading, eventsError] = useQueryData(query(collection(getFirestore(), 'events')));
  const [config, configLoading, configError] = useDocumentData(doc(getFirestore(), 'config', 'config'));

  if (eventsLoading || configLoading || eventsError || configError) {
    return <ThemedLoading />;
  }

  return (
    <NoSsr>
      <ThemeProvider theme={theme}>
        <TopBannerProvider>
          <DevBanner />
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
        </TopBannerProvider>
      </ThemeProvider>
    </NoSsr>
  );
};

export default App;
