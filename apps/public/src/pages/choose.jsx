import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { getFirestore, collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import {
  Hidden,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Stack,
} from "@mui/material";
import { ThemeProvider  } from "@mui/material/styles";

import BgImage from "@malenovska/common/assets/images/background.jpg";

import { darkTheme } from "../utilities/theme";
import { Logo, EventAvailabilityChip, Markdown } from "../components";
import { EventProvider, useEvent } from "../contexts/EventContext";


const EventItem = () => {
  const [event] = useEvent();

  return (
    <Grid item sx={{ minWidth: "100%" }}>
      <Link component={RouterLink} underline="none" to={"/" + event.id}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {event.name}
                <EventAvailabilityChip sx={{ ml: 2 }}/>
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
  const [events, eventsLoading, eventsError] = useCollectionData(query(collection(getFirestore(), 'events'), where("display", "==", true)));

  const today = new Date();

  const thisYear = eventsLoading || eventsError
    ? []
    : events
        .filter(({ date, display }) => display && cmpYear(getYear(date), today))
        .sort(cmpDate);

  const pastYears = eventsLoading || eventsError
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
        sx={{
          minHeight: "100vh",
          background: `url(${BgImage}) no-repeat center center fixed`,
          backgroundSize: "cover",
        }}
      >
        <Grid
          item
          sm={12}
          md={4}
          lg={3}
        >
          <Stack spacing={2} 
  justifyContent="center"
  alignItems="center" sx={{ padding: (t) => t.spacing(2),
            minHeight: "100vh",
            backgroundColor: "rgba(0, 0, 0, .75)"}}>
            <Typography variant="overline" color="primary.dark">
              Malenovské události roku {today.getFullYear()}
            </Typography>
            {thisYear.map((event) => (
              <EventProvider key={event.id} event={event}>
                <EventItem />
              </EventProvider>
            ))}
            <Typography variant="overline" color="primary.dark">
              V letech minulých
            </Typography>
            {pastYears.map((event) => (
              <EventProvider key={event.id} event={event}>
                <EventItem />
              </EventProvider>
            ))}
          </Stack>
        </Grid>
        <Hidden smDown>
          <Grid
            item
            md={8}
            lg={9}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ color: "#fff" }}
          >
            <Typography gutterBottom variant="h1" sx={{ fontWeight: 600, fontSize: "9rem" }}>
              Malen
              <Logo
                size="5rem"
                bgColor="#fff"
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
