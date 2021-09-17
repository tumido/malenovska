import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { IconButton, Icon, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  action: {
    padding: theme.spacing(1),
  },
}));

export const NotificationAction = ({ action, onClose }) => {
  const classes = useStyles();

  return action === "close" ? (
    <IconButton
      key="close"
      aria-label="close"
      color="inherit"
      className={classes.action}
      onClick={onClose}
    >
      <Icon>close</Icon>
    </IconButton>
  ) : action === "spinner" ? (
    <CircularProgress color="secondary" className={classes.action} />
  ) : null;
};

export default NotificationAction;
