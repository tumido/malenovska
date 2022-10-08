import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import BgImage from "@malenovska/common/assets/images/background.jpg";

import { Header, Footer, Loading, ScrollRestore } from "../components";
import { useEventRouter } from "../router";
import { EventProvider } from "../contexts/EventContext";
import { TopBannerProvider } from "../contexts/TopBannerContext";
import { styled } from "@mui/material";

const Div = styled('div')(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100vh",
    width: "100%",
    pt: { xs: 10, sm: 20 },
    background: { sm: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) repeat-x top center fixed`},
    "& main": {
      flexGrow: 1,
    }
}));

const Home = ({event}) => {

  if (!event) {
    return (
      <Loading />
    );
  }

  const navigation = useEventRouter(event);

  return (
    <ScrollRestore>
      <SnackbarProvider>
        <Helmet>
          <title>{`${event.name} ${event.year}`}</title>
        </Helmet>
        <EventProvider event={event}>
          <TopBannerProvider>
            <Header navigation={navigation} />
            <Div>
              <div id="top" />
              <main>
                {/* <Routes>
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
                </Routes> */}
              </main>
              <Footer />
            </Div>
          </TopBannerProvider>
        </EventProvider>
      </SnackbarProvider>
    </ScrollRestore>
  );
};

export default Home;
