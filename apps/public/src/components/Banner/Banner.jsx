import React from "react";
import PropTypes from "prop-types";

import { Grid, Hidden, Container, Chip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { EventAvailabilityChip } from "components";

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
      fontSize: "xx-large",
    },
  },
  banner: {
    paddingTop: "10vh",
    minHeight: "25vh",
    color: "#fff",
    marginBottom: 30,
  },
  container: {
    [theme.breakpoints.down("xs")]: {
      paddingBottom: "0.75em",
      marginBottom: "1em",
    },
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

const Banner = ({ event, title, children }) => {
  const styles = useStyles();

  return (
    <Container className={styles.container}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        spacing={2}
        alignItems="center"
        className={styles.banner}
      >
        <Grid item>
          {title && (
            <Typography variant="h2" className={styles.h2}>
              {title}
            </Typography>
          )}
          <Typography gutterBottom variant="h1" className={styles.h1}>
            {event.name}
          </Typography>
          <Chip
            label={event.type ? "Bitva" : "Šarvátka"}
            className={styles.chip}
          />
          <Chip
            label={`${event.type ? "Podzim" : "Jaro"} ${event.year}`}
            className={styles.chip}
          />
          <EventAvailabilityChip event={event} className={styles.chip} />
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
  event: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Banner;
