import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";

import { CssBaseline, NoSsr } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";

import BgImage from "@malenovska/common/assets/images/background.jpg";
import DefaultOgImage from "@malenovska/common/assets/images/og_image.jpg";

import { Loading } from "./components";
import { theme } from "./utilities/theme";

const NotFound = lazy(() => import("./pages/404"));
const Landing = lazy(() => import("./pages/choose"));
const Public = lazy(() => import("./pages"));

const Div = styled('div')((theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100vh",
    [theme.breakpoints.up("sm")]: {
      background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center/cover fixed`,
    },
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
  useFirestoreConnect(() => [{ collection: "events" }]);
  useFirestoreConnect(() => [{ collection: "config", doc: "config" }]);
  const events = useSelector(({ firestore }) => firestore.ordered.events);
  const config = useSelector(({ firestore }) => firestore.data.config);

  if (!isLoaded(events) || !isLoaded(config)) {
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
          <Routes>
            {isLoaded(events) &&
              events.map((event) => (
                <Route
                  key={`route_${event.id}`}
                  path={"/" + event.id}
                  element={<Public event={event} />}
                />
              ))}
            <Route
              exact
              path="/"
              element={<Navigate to={`/${config.config.event}`} replace />}
            />
            <Route exact path="/choose" component={Landing} />
            <Route component={NotFound} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </NoSsr>
  );
};

export default App;
