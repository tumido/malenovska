import React from "react";
import PropTypes from "prop-types";

import { Grid, Container, Chip, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Logo, EventAvailabilityChip } from ".";
import { useEvent } from "../contexts/EventContext";
import { darkTheme } from "../utilities/theme";


const Banner = ({ title, children, showDetails = false }) => {
  const [event] = useEvent();

  const splitAt = event.name.indexOf("o");

  return (
    <Container
      sx={(theme) => ({ [theme.breakpoints.down("xs")]: { m: 0, p: 0 } })}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={(theme) => ({
          [theme.breakpoints.down("xs")]: {
            backgroundColor: "primary.main",
            pt: "50px",
            m: 0,
          },
          pt: "10vh",
          minHeight: "25vh",
          color: "#fff",
          mb: "30px",
        })}
      >
        <Grid item>
          <ThemeProvider theme={darkTheme}>
            {title && (
              <Typography
                variant="h2"
                sx={(theme) => ({
                  fontWeight: 600,
                  color: "black",
                  mb: -2,
                  [theme.breakpoints.down("xs")]: {
                    mb: 0,
                    color: "#ccc",
                    fontSize: "xx-large",
                  },
                })}
              >
                {title}
              </Typography>
            )}
          </ThemeProvider>
          <Typography
            gutterBottom
            variant="h1"
            sx={(theme) => ({
              fontWeight: 600,
              [theme.breakpoints.down("xs")]: {
                fontSize: "xxx-large",
              },
            })}
          >
            {event.name.slice(0, splitAt)}
            <Logo size=".55em" />
            {event.name.slice(splitAt + 1)}
          </Typography>
          {showDetails && (
            <>
              <Chip label={event.type ? "Bitva" : "Šarvátka"} sx={{ m: 1 }} />
              <Chip
                label={`${event.type ? "Podzim" : "Jaro"} ${event.year}`}
                sx={{ m: 1 }}
              />
              <EventAvailabilityChip sx={{ m: 1 }} />
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
