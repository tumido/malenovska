import React from "react";
import { Grid } from "@mui/material";
import { grey } from "@mui/material/colors";

const Footer = () => (
  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    component="footer"
    sx={{
      p: "3rem 0",
      color: grey[400],
      "& a, & a:hover": {
        color: "inherit",
      },
    }}
  >
    <Grid item>
      Zlišky{" "}
      <span role="img" area-label="heart-emoji">
        ❤️
      </span>{" "}
      Malenovská
    </Grid>
    <Grid item>Pod záštitou spolku Strážci Mezihoří, z.s.</Grid>
    <Grid item>
      <a href="https://reactjs.org/">React</a>,{" "}
      <a href="https://redux.js.org/">Redux</a>,{" "}
      <a href="https://firebase.google.com/docs/firestore/">
        Google Cloud Firestore
      </a>
    </Grid>
  </Grid>
);

export default Footer;
