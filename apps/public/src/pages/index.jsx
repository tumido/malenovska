import React, { lazy } from "react";
import { Helmet } from "react-helmet";
import { Route, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import BgImage from "@malenovska/common/assets/images/background.jpg";

import { Header, Footer, Loading, ScrollRestore } from "../components";
import { useEventRouter } from "../router";
import { EventProvider } from "../contexts/EventContext";
import { useTopBanner } from "../contexts/TopBannerContext";
import { TopBannerProvider } from "../contexts/TopBannerContext";
import { styled } from "@mui/material";

const NotFound = lazy(() => import("./404"));

const Div = styled('div')(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100vh",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: "20px",
    },
    paddingTop: "10px",
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
    backgroundColor: '#000',
    "& main": {
      flexGrow: 1,
    }
}));

const Root = styled('div')({
  display: "flex",
})

const Main = ({ children }) => {
  const { setTopBanner } = useTopBanner();

  if (DEVELOPMENT === true) {
    setTopBanner("DEVELOPMENT");
  }

  return <main>{children}</main>
}

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
          <Root>
          <TopBannerProvider>
            <Header navigation={navigation} />
            <Div>
              <div id="top" />
              <Main>
                <Routes>
                  {navigation.map((i) => {
                    if (!i.path || !i.component) {
                      return null
                    }
                    const Component = i.component
                    return (
                      <Route
                        key={i.path}
                        path={i.path}
                        element={<Component />}
                      />
                    );
                  })}
                  <Route path="" element={<Navigate to='legends' />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Main>
              <Footer />
            </Div>
          </TopBannerProvider>
          </Root>
        </EventProvider>
      </SnackbarProvider>
    </ScrollRestore>
  );
};

export default Home;
