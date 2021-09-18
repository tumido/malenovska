import React from "react";
import PropTypes from "prop-types";

import { Grid, Container, Chip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { Breadcrumbs, Logo, EventAvailabilityChip } from ".";
import { useEvent } from "../contexts/EventContext";
import { darkTheme } from "../utilities/theme";

const useStyles = makeStyles((theme) => ({
  h1: {
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "xxx-large",
    },
  },
  h2: {
    fontWeight: 600,
    color: "black",
    marginBottom: theme.spacing(-2),
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(0),
      color: "#ccc",
      fontSize: "xx-large",
    },
  },
  banner: {
    [theme.breakpoints.down("xs")]: {
      backgroundColor: theme.palette.primary.main,
      paddingTop: "50px",
      margin: 0,
    },
    paddingTop: "10vh",
    minHeight: "25vh",
    color: "#fff",
    marginBottom: 30,
  },
  container: {
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      padding: 0,
    },
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

const Banner = ({ title, children, showDetails = false }) => {
  const styles = useStyles();
  const [event] = useEvent();

  const splitAt = event.name.indexOf("o");

  return (
    <Container className={styles.container}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.banner}
      >
        <Grid item>
          <ThemeProvider theme={darkTheme}>
            {title && (
              <Typography variant="h2" className={styles.h2}>
                {title}
              </Typography>
            )}
          </ThemeProvider>
          <Typography gutterBottom variant="h1" className={styles.h1}>
            {event.name.slice(0, splitAt)}
            <Logo size=".55em" />
            {event.name.slice(splitAt + 1)}
          </Typography>
          {showDetails && (
            <>
              <Chip
                label={event.type ? "Bitva" : "Šarvátka"}
                className={styles.chip}
              />
              <Chip
                label={`${event.type ? "Podzim" : "Jaro"} ${event.year}`}
                className={styles.chip}
              />
              <EventAvailabilityChip className={styles.chip} />
            </>
          )}
        </Grid>
        {React.Children.map(children, (c, idx) => (
          <Grid item key={idx}>
            {c}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

Banner.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Banner;
