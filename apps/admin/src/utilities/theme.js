import { createTheme } from '@mui/material/styles';
import { grey, indigo } from "@mui/material/colors";
import { csCZ } from "@mui/material/locale";

export const adminTheme = createTheme(
  {
    palette: {
      primary: indigo,
      secondary: {
        main: grey[900],
      },
    },
    sidebar: {
      width: 200,
    },
    overrides: {
      RaMenuItemLink: {
        root: {
          borderLeft: "3px solid #fff",
        },
        active: {
          borderLeft: "3px solid #4f3cc9",
        },
      },
      MuiPaper: {
        elevation1: {
          boxShadow: "none",
        },
        root: {
          border: "1px solid #e0e0e3",
          backgroundClip: "padding-box",
        },
      },
      MuiButton: {
        contained: {
          backgroundColor: "#fff",
          color: "#4f3cc9",
          boxShadow: "none",
        },
      },
      MuiButtonBase: {
        root: {
          "&:hover:active::after": {
            // recreate a static ripple color
            // use the currentColor to make it work both for outlined and contained buttons
            // but to dim the background without dimming the text,
            // put another element on top with a limited opacity
            content: '""',
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "currentColor",
            opacity: 0.3,
            borderRadius: "inherit",
          },
        },
      },
      MuiAppBar: {
        colorSecondary: {
          // color: "#808080",
          border: "none",
          backgroundColor: grey[900],
        },
      },
      MuiLinearProgress: {
        colorPrimary: {
          backgroundColor: "#f5f5f5",
        },
        barColorPrimary: {
          backgroundColor: "#d7d7d7",
        },
      },
      MuiFilledInput: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
      MuiSnackbarContent: {
        root: {
          border: "none",
        },
      },
    },
    props: {
      MuiButtonBase: {
        // disable ripple for perf reasons
        disableRipple: true,
      },
    },
  },
  csCZ
);
