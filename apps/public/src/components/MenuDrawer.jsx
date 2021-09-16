import React from "react";
import clsx from "clsx";

import {
  Hidden,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";

import { darkTheme } from "../utilities/theme";

import AdapterLink from "./AdapterLink";
import { useEvent } from "../contexts/EventContext";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: "20px 0",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: grey[900],
    color: "#fff",
  },
  secondary: {
    color: grey[500],
  },
  block: {
    display: "block",
  },
}));

const MenuDrawer = ({ navigation, pathname, onClick }) => {
  const classes = useStyles();
  const [event] = useEvent();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.icon}>
        <Hidden mdUp>
          <IconButton onClick={onClick}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </div>
      <div onClick={onClick}>
        <List>
          {navigation.map((item, idx) => {
            if (item.type === "visible") {
              return (
                <ListItem
                  key={item.path || `item_${idx}`}
                  button
                  selected={
                    pathname.startsWith(item.path) ||
                    item.owns?.some((i) => pathname.startsWith(i))
                  }
                  disabled={!item.path || item.disabled}
                  to={item.path || "/"}
                  component={AdapterLink}
                >
                  <ListItemIcon>
                    <Icon
                      className={clsx(`${classes.icon}, ${item.className}`)}
                    >
                      {item.icon}
                    </Icon>
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            }
            if (item.type === "divider")
              return (
                <Divider key={`divider_${idx}`} className={classes.divider} />
              );
          })}
        </List>
      </div>
      <List component="nav" aria-label="vyber udalosti">
        <ListItem button to="/choose" component={AdapterLink}>
          <ListItemIcon>
            <Icon fontSize="large" className={classes.icon}>
              dashboard
            </Icon>
          </ListItemIcon>
          <ListItemText
            secondaryTypographyProps={{ className: classes.secondary }}
            primary="Další ročníky"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  className={classes.block}
                  variant="body2"
                >
                  Právě prohlížíte:
                </Typography>
                {event.name} {event.year}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </ThemeProvider>
  );
};

export default MenuDrawer;
