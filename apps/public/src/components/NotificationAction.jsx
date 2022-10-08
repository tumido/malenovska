import React from "react";

import { IconButton, Icon, CircularProgress } from "@mui/material";

export const NotificationAction = ({ action, onClose }) =>
  action === "close" ? (
    <IconButton
      key="close"
      aria-label="close"
      color="inherit"
      className={classes.action}
      sx={{ p: 1 }}
      onClick={onClose}
    >
      <Icon>close</Icon>
    </IconButton>
  ) : action === "spinner" ? (
    <CircularProgress color="secondary" sx={{ p: 1 }} />
  ) : null;

export default NotificationAction;
