import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";

import { Logo } from "../components";
import BgImage from "@malenovska/common/assets/images/background.jpg";
import { Helmet } from "react-helmet";


const NotFound = () => (
  <Grid
    container
    spacing={2}
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{
      minHeight: "100vh",
      background: `url(${BgImage}) no-repeat center center fixed`,
      backgroundSize: "cover",
      color: "#fff",
      margin: 0,
      width: "100vw",
    }}
  >
    <Helmet title="Nenalezeno" />
    <Grid item>
      <Typography gutterBottom variant="h1" sx={{ fontWeight: 600, fontSize: "9rem" }}>
        Nenalezen
        <Logo size="5rem" bgColor="#fff" fgColor="#000" />
      </Typography>
    </Grid>
    <Grid item>
      <Typography gutterBottom variant="body1">
        Tato stránka byla náhodou sežrána organizátory, či spálena gobliny.
      </Typography>
    </Grid>
    <Grid item>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        to="/"
        component={Link}
      >
        Chci na hlavní stránku
      </Button>
    </Grid>
  </Grid>
);

export default NotFound;
