import React from "react";
import { Helmet } from "react-helmet";
import { Route, Redirect, useParams, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { makeStyles } from "@mui/material/styles";
import BgImage from "@malenovska/common/assets/images/background.jpg";

import { Header, Footer, Loading, ScrollRestore } from "../components";
import { useEventRouter } from "../router";
import { EventProvider } from "../contexts/EventContext";
import { TopBannerProvider } from "../contexts/TopBannerContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#000",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100vh",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center fixed`,
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: 10,
    },
    paddingTop: 20,
    "& main": {
      flexGrow: 1,
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const {event} = useParams();

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
          <EventProvider event={event}>
            <TopBannerProvider>
              <Header navigation={navigation} />
              <div className={classes.content}>
                <div id="top" />
                <main>
                  <Routes>
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
                    <Route path="" element={<Navigate to='legends' />}
                    />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </TopBannerProvider>
          </EventProvider>
        </div>
      </SnackbarProvider>
    </ScrollRestore>
  );
};

export default Home;
