import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0, 0.8)",
    display: "flex",
    alignItems: "center",
    zIndex: 1300,
  },
  spinner: {
    display: "block",
    position: "relative",
    width: "100px",
    height: "100px",
    margin: "0 auto",
    borderRadius: "50%",
    border: "3px solid transparent",
    borderTopColor: theme.palette.loading[0],
    animation: "$spin 2s linear infinite",

    "&:before": {
      content: '""',
      position: "absolute",
      top: "3px",
      left: "3px",
      right: "3px",
      bottom: "3px",
      borderRadius: "50%",
      border: "3px solid transparent",
      borderTopColor: theme.palette.loading[1],
      animation: "$spin 3s linear infinite",
    },

    "&:after": {
      content: '""',
      position: "absolute",
      top: "9px",
      left: "9px",
      right: "9px",
      bottom: "9px",
      borderRadius: "50%",
      border: "3px solid transparent",
      borderTopColor: theme.palette.loading[2],
      animation: "$spin 1.5s linear infinite",
    },
  },
  "@keyframes spin": {
    "0% ": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.spinner} />
    </div>
  );
};

export default Loading;
