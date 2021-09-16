import React from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { useFirestoreConnect, isLoaded } from "react-redux-firebase";

import {
  Hidden,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import BgImage from "@malenovska/common/assets/images/background.jpg";

import { darkTheme } from "../utilities/theme";
import { Logo, EventAvailabilityChip, Markdown } from "../components";
import { EventProvider, useEvent } from "../contexts/EventContext";

const useStyles = makeStyles((theme) => ({
  h1: {
    fontWeight: 600,
    fontSize: "9rem",
  },
  root: {
    minHeight: "100vh",
    background: `url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
  },
  logo: {
    color: "#fff",
  },
  eventList: {
    [theme.breakpoints.up("md")]: {
      minHeight: "100vh",
    },
    backgroundColor: "rgba(0, 0, 0, .75)",
    margin: 0,
  },
  event: {
    minWidth: "100%",
  },
  chip: {
    float: "right",
    marginLeft: theme.spacing(1),
  },
}));

const EventItem = () => {
  const classes = useStyles();
  const [event] = useEvent();

  return (
    <Grid item className={classes.event}>
      <Link component={RouterLink} underline="none" to={event.id}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {event.name}
                <EventAvailabilityChip className={classes.chip} />
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {event.type ? "Bitva, podzim" : "Šarvátka, jaro"} {event.year}
              </Typography>
              <Markdown content={event.description} />
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
};

const cmpDate = (a, b) => (a.date < b.date ? 1 : -1);
const getYear = (date) =>
  (date && date.toDate && date.toDate().getFullYear()) || 0;
const cmpYear = (year, today) => year === today.getFullYear();

const Choose = () => {
  const classes = useStyles();
  useFirestoreConnect(() => [
    {
      collection: "events",
      where: ["display", "==", true],
    },
  ]);

  const events = useSelector(({ firestore }) => firestore.ordered.events);

  const today = new Date();

  const thisYear = !isLoaded(events)
    ? []
    : events
        .filter(({ date, display }) => display && cmpYear(getYear(date), today))
        .sort(cmpDate);

  const pastYears = !isLoaded(events)
    ? []
    : events
        .filter(
          ({ date, display }) => display && !cmpYear(getYear(date), today)
        )
        .sort(cmpDate);

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        className={classes.root}
      >
        <Grid
          item
          sm={12}
          md={4}
          lg={3}
          container
          spacing={4}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.eventList}
        >
          <Typography variant="overline" color="textSecondary">
            Malenovské události roku {today.getFullYear()}
          </Typography>
          {thisYear.map((event) => (
            <EventProvider key={event.id} event={event}>
              <EventItem />
            </EventProvider>
          ))}
          <Typography variant="overline" color="textSecondary">
            V letech minulých
          </Typography>
          {pastYears.map((event) => (
            <EventProvider key={event.id} event={event}>
              <EventItem />
            </EventProvider>
          ))}
        </Grid>
        <Hidden smDown>
          <Grid
            item
            xs={12}
            md={8}
            lg={9}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={classes.logo}
          >
            <Typography gutterBottom variant="h1" className={classes.h1}>
              Malen
              <Logo
                size="5rem"
                bgColor={darkTheme.palette.text.primary}
                fgColor="#000"
              />
              vská
            </Typography>
            <Typography variant="body1">
              Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajímá.
            </Typography>
          </Grid>
        </Hidden>
      </Grid>
    </ThemeProvider>
  );
};

export default Choose;
