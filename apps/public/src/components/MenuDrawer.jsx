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
}));

const MenuDrawer = ({ event, navigation, pathname, onClick }) => {
  const classes = useStyles();

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
        {navigation.map((section, index) => (
          <React.Fragment key={`sec_${index}`}>
            <List>
              {section.map((item, index) => (
                <ListItem
                  key={`item_${index}`}
                  button
                  selected={pathname.startsWith(`/${event.id}/${item.href}`)}
                  disabled={!item.href || item.disabled}
                  to={`/${event.id}/${item.href}`}
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
              ))}
            </List>
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
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
                <Typography component="p" variant="body2">
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
