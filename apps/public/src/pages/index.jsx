import React, { lazy } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { makeStyles } from "@material-ui/core/styles";
import BgImage from "@malenovska/common/assets/images/background.jpg";

import {
  Header,
  Footer,
  Loading,
  Notifier,
  ScrollRestore,
} from "../components";
import { setEvent } from "../redux/actions/event-actions";
import { useEventRouter } from "../router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#000",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center fixed`,
    minHeight: "100vh",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 10,
    },
    paddingTop: 20,
    "& main": {
      flexGrow: 1,
    },
  },
}));

const Home = ({ event, setEvent }) => {
  const classes = useStyles();
  React.useEffect(() => {
    setEvent(event);
  });

  if (!event) {
    return (
      <div className={classes.content}>
        <Loading />
      </div>
    );
  }

  const navigation = useEventRouter(event);

  return (
    <ScrollRestore>
      <SnackbarProvider>
        <div className={classes.root}>
          <Helmet>
            <title>{`${event.name} ${event.year}`}</title>
          </Helmet>
          <Header event={event} navigation={navigation} />
          <div className={classes.content}>
            <div id="top" />
            <main>
              <Switch>
                {navigation.map((i) => {
                  if (i.path && i.component)
                    return (
                      <Route
                        key={i.path}
                        path={i.path}
                        component={i.component}
                      />
                    );
                })}
                <Redirect
                  exact
                  from={`/${event.id}`}
                  to={`/${event.id}/legends`}
                />
                <Redirect to="/not-found" />
              </Switch>
            </main>
            <Footer />
            <Notifier />
          </div>
        </div>
      </SnackbarProvider>
    </ScrollRestore>
  );
};

Home.propTypes = {
  event: PropTypes.object,
  setEvent: PropTypes.func,
};

export default connect(null, { setEvent })(Home);
