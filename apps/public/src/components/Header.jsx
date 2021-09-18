import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import {
  AppBar,
  Hidden,
  Drawer,
  Toolbar,
  IconButton,
  Icon,
  SwipeableDrawer,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { grey } from "@material-ui/core/colors";

import { Breadcrumbs, MenuDrawer } from ".";
import { useTopBanner } from "../contexts/TopBannerContext";
import { darkTheme } from "../utilities/theme";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  paper: {
    width: drawerWidth,
    backgroundColor: grey[900],
    color: "#fff",
  },
  appBar: {
    right: "unset",
    width: "unset",
    marginTop: "10px",
    borderBottomRightRadius: "10px",
    borderTopRightRadius: "10px",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  banner: {
    display: "block",
    padding: 8,
    textAlign: "center",
    backgroundColor: theme.palette.secondary.dark,
    color: "white",
  },
}));

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const Header = ({ navigation, location: { pathname } }) => {
  const classes = useStyles();
  const { banner } = useTopBanner();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <Hidden mdUp>
        <AppBar
          position="fixed"
          // className={classes.appBar}
          color="primary"
          elevation={0}
        >
          {banner && (
            <Typography variant="body2" className={classes.banner} noWrap>
              {banner}
            </Typography>
          )}
          <ThemeProvider theme={darkTheme}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerOpen}
              >
                <Icon>menu</Icon>
              </IconButton>
              <Breadcrumbs variant="h6" />
            </Toolbar>
          </ThemeProvider>
        </AppBar>
      </Hidden>
      {banner && (
        <Hidden smDown>
          <AppBar
            position="fixed"
            color="secondary"
            className={classes.appBarShift}
            elevation={0}
          >
            <Typography variant="body2" className={classes.banner} noWrap>
              {banner}
            </Typography>
          </AppBar>
        </Hidden>
      )}
      <nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            open={drawerOpen}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
            classes={{ paper: classes.paper }}
            ModalProps={{
              keepMounted: true /* Better open performance on mobile */,
            }}
          >
            <MenuDrawer
              navigation={navigation}
              pathname={pathname}
              onClick={handleDrawerClose}
            />
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            classes={{ paper: classes.paper }}
            ModalProps={{
              keepMounted: true /* Better open performance on mobile */,
            }}
            open
          >
            <MenuDrawer navigation={navigation} pathname={pathname} />
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>
  );
};

Header.propTypes = {
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      path: PropTypes.string,
      icon: PropTypes.string,
      className: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Header);
