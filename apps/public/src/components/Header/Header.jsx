import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";

import {
  AppBar,
  Hidden,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
  SwipeableDrawer,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";

import { darkTheme } from "../../utilities/theme";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerDivider: {
    margin: "20px 0",
  },
  drawerHeader: {
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
  drawerSecondary: {
    color: grey[500],
  },
  icon: {
    color: "#fff",
  },
  appBar: {
    right: "unset",
    width: "unset",
    marginTop: "10px",
    borderBottomRightRadius: "10px",
    borderTopRightRadius: "10px",
  },
}));

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// eslint-disable-next-line react/display-name
const AdapterLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const Header = ({ event, navigation, location: { pathname } }) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const drawer = (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.drawerHeader}>
        <Hidden mdUp>
          <IconButton onClick={handleDrawerClose}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </div>
      <div onClick={handleDrawerClose}>
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
            <Divider className={classes.drawerDivider} />
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
            secondaryTypographyProps={{ className: classes.drawerSecondary }}
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

  return (
    <React.Fragment>
      <Hidden mdUp>
        <AppBar
          position="fixed"
          className={classes.appBar}
          color="secondary"
          elevation={0}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerOpen}
              className={classes.menuButton}
            >
              <Icon>menu</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            open={drawerOpen}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{
              keepMounted: true /* Better open performance on mobile */,
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{
              keepMounted: true /* Better open performance on mobile */,
            }}
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>
  );
};

Header.propTypes = {
  event: PropTypes.object,
  navigation: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        hasBanner: PropTypes.bool,
        title: PropTypes.string.isRequired,
        href: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string,
        disabled: PropTypes.bool,
      })
    )
  ).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Header);
