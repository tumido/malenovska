import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import BgImage from "@malenovska/common/assets/images/background.jpg";
import { Loading } from ".";
import { theme } from "../utilities/theme";

export const Div = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  minHeight: "100vh",
  [theme.breakpoints.up("sm")]: {
    background: `linear-gradient(to bottom, transparent 80%, #000 100%), url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
  },
}));

export const ThemedLoading = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Div>
      <Loading />
    </Div>
  </ThemeProvider>
);


export default ThemedLoading
