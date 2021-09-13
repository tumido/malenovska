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

const Gallery = lazy(() => import("./gallery"));
const Legends = lazy(() => import("./legends"));
const LegendId = lazy(() => import("./legend/id"));
const Rules = lazy(() => import("./rules"));
const Info = lazy(() => import("./info"));
const Contacts = lazy(() => import("./contacts"));
const Races = lazy(() => import("./races"));
const RaceId = lazy(() => import("./race/id"));
const RegistrationNew = lazy(() => import("./registration/new"));
const RegistrationSuccess = lazy(() => import("./registration/success"));
const Attendees = lazy(() => import("./attendees"));

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const navigation = [
    [
      {
        title: "Legendy a příběhy",
        icon: "receipt",
        href: "legends",
      },
      {
        title: "Pravidla",
        icon: "gavel",
        href: "rules",
      },
      {
        title: "Svět",
        icon: "map",
      },
      {
        title: "Bojující strany",
        icon: "group",
        href: "races",
      },
      {
        title: "Důležité informace",
        icon: "location_on",
        href: "info",
      },
      {
        title: "Kontakty",
        icon: "mail_outline",
        href: "contacts",
      },
      {
        title: "Galerie",
        className: "material-icons-outlined",
        icon: "collections_outline",
        href: "gallery",
        disabled: event.date.toDate() > tomorrow,
      },
    ],
    [
      {
        title: "Nová registrace",
        icon: "person_add",
        href: "registration/new",
        disabled:
          !event.registrationAvailable &&
          process.env.NODE_ENV !== "development",
      },
      {
        title: "Účastníci",
        icon: "how_to_reg",
        href: "attendees",
        disabled: event.date.toDate() < tomorrow,
      },
    ],
  ];

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
                <Route path={`/${event.id}/legend/:id`} component={LegendId} />
                <Route path={`/${event.id}/legends`} component={Legends} />
                <Route path={`/${event.id}/rules`} component={Rules} />
                <Route path={`/${event.id}/info`} component={Info} />
                <Route path={`/${event.id}/contacts`} component={Contacts} />
                <Route path={`/${event.id}/race/:id`} component={RaceId} />
                <Route path={`/${event.id}/races`} component={Races} />
                <Route
                  path={`/${event.id}/registration/new`}
                  component={RegistrationNew}
                />
                <Route
                  path={`/${event.id}/registration/done`}
                  component={RegistrationSuccess}
                />
                <Route path={`/${event.id}/attendees`} component={Attendees} />
                <Route path={`/${event.id}/gallery`} component={Gallery} />
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
