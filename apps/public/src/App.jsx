import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";

import { CssBaseline, NoSsr } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import BgImage from "@malenovska/common/assets/images/background.jpg";
import DefaultOgImage from "@malenovska/common/assets/images/og_image.jpg";

import { Loading } from "./components";
import { theme } from "./utilities/theme";

const NotFound = lazy(() => import("./pages/404"));
const Landing = lazy(() => import("./pages/choose"));
const Public = lazy(() => import("./pages"));

const useStyles = makeStyles(() => ({
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center/cover fixed`,
    minHeight: "100vh",
  },
}));

const ThemedLoading = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.content}>
        <Loading />
      </div>
    </ThemeProvider>
  );
};

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
          <Switch>
            {isLoaded(events) &&
              events.map((event) => (
                <Route
                  key={`route_${event.id}`}
                  path={"/" + event.id}
                  render={(props) => <Public {...props} event={event} />}
                />
              ))}
            <Route
              exact
              path="/"
              render={() => <Redirect to={`/${config.config.event}`} />}
            />
            <Route exact path="/choose" component={Landing} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ThemeProvider>
    </NoSsr>
  );
};

export default App;
