import React from "react";
import { Grid } from "@mui/material";
import { grey } from "@mui/material/colors";
import { makeStyles } from "@mui/material/styles";

const useStyles = makeStyles({
  root: {
    padding: "3rem 0",
    color: grey[400],
    "& a, & a:hover": {
      color: "inherit",
    },
  },
});

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      component="footer"
      className={classes.root}
    >
      <Grid item>
        Zlišky{" "}
        <span role="img" area-label="heart-emoji">
          ❤️
        </span>{" "}
        Malenovská
      </Grid>
      <Grid item>
        <a href="https://reactjs.org/">React</a>,{" "}
        <a href="https://redux.js.org/">Redux</a>,{" "}
        <a href="https://firebase.google.com/docs/firestore/">
          Google Cloud Firestore
        </a>
      </Grid>
    </Grid>
  );
};

export default Footer;
