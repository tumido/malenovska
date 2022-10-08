import React, { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router";

import {
  AppBar,
  Hidden,
  Drawer,
  Toolbar,
  IconButton,
  Icon,
  SwipeableDrawer,
  Typography,
  styled,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import { Breadcrumbs, MenuDrawer } from ".";
import { useTopBanner } from "../contexts/TopBannerContext";
import { darkTheme } from "../utilities/theme";

const drawerWidth = 300;

const paperStyle = {
  width: drawerWidth,
  backgroundColor: grey[900],
  color: "#fff",
}

const appBarStyle = {
  right: 'unset',
  width: "unset",
  marginTop: "10px",
  borderBottomRightRadius: "10px",
  borderTopRightRadius: "10px",
}

const bannerStyle = {
  display: "block",
  padding: 8,
  textAlign: "center",
  backgroundColor: 'secondary.dark',
  color: "white",
}

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const Nav = styled('nav')({
  width: { md: drawerWidth },
  flexShrink: { md: 0 }
})

const Header = ({navigation}) => {
  const { banner } = useTopBanner();
  const {pathname} = useLocation();

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
          sx={appBarStyle}
          color="primary"
          elevation={0}
        >
          {banner && (
            <Typography variant="body2" sx={bannerStyle} noWrap>
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
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              ml: drawerWidth,
              transition: (t) => t.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              })
            }}
            elevation={0}
          >
            <Typography variant="body2" sx={bannerStyle} noWrap>
              {banner}
            </Typography>
          </AppBar>
        </Hidden>
      )}
      <Nav>
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            open={drawerOpen}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
            sx={paperStyle}
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
            sx={paperStyle}
            ModalProps={{
              keepMounted: true /* Better open performance on mobile */,
            }}
            open
          >
            <MenuDrawer navigation={navigation} pathname={pathname} />
          </Drawer>
        </Hidden>
      </Nav>
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
  ).isRequired
};

export default Header;
