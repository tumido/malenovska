import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import clsx from "clsx";

import {
  AppBar,
  Hidden,
  Drawer,
  Toolbar,
  IconButton,
  Icon,
  SwipeableDrawer,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

import MenuDrawer from "./MenuDrawer";

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
}));

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const Header = ({ navigation, location: { pathname } }) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
