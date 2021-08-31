import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import {
  AppBar, Hidden, Drawer, Toolbar, Typography, IconButton, Divider, List,
  ListItem, ListItemText, ListItemIcon, Menu, MenuItem, Icon, SwipeableDrawer
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

import { darkTheme } from '../../utilities/theme';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  drawerDivider: {
    margin: '20px 0'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: grey[900],
    color: '#fff'
  },
  drawerSecondary: {
    color: grey[500]
  },
  icon: {
    color: '#fff'
  }
}));

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// eslint-disable-next-line react/display-name
const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ ref } { ...props } />);

const Header = ({ event, allEvents, navigation, location: { pathname }}) => {
  const classes = useStyles();

  const [ drawerOpen, setDrawerOpen ] = React.useState(false);
  const [ menuOpen, setMenuOpen ] = React.useState(null);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
    handleDrawerClose();
  };

  const drawer = (
    <ThemeProvider theme={ darkTheme }>
      <div className={ classes.drawerHeader }>
        <Hidden mdUp>
          <IconButton onClick={ handleDrawerClose }>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </div>
      <div onClick={ handleDrawerClose }>
        { navigation.map((section, index) => (
          <React.Fragment key={ `sec_${index}` }>
            <List>
              { section.map((item, index) => (
                <ListItem
                  key={ `item_${index}`  }
                  button
                  selected={ pathname.startsWith(`/${event.id}/${item.href}`) }
                  disabled={ !item.href || item.disabled }
                  to={ `/${event.id}/${item.href}` }
                  component={ AdapterLink }
                >
                  <ListItemIcon><Icon className={ clsx(`${classes.icon}, ${item.className}`) }>{ item.icon }</Icon></ListItemIcon>
                  <ListItemText primary={ item.title } />
                </ListItem>
              )) }
            </List>
            <Divider className={ classes.drawerDivider }/>
          </React.Fragment>
        )) }
      </div>
      <List component="nav" aria-label="vyber udalosti">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={ handleMenuOpen }
        >
          <ListItemIcon><Icon fontSize='large' className={ classes.icon }>dashboard</Icon></ListItemIcon>
          <ListItemText secondaryTypographyProps={ { className: classes.drawerSecondary } } primary="Událost" secondary={ event.name } />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={ menuOpen }
        keepMounted
        open={ Boolean(menuOpen) }
        onClick={ handleMenuClose }
      >
        { allEvents.filter(({ display }) => display).sort(({year: year1}, {year: year2}) => year1 > year2 ? -1 : 1).map(option => (
          <MenuItem
            key={ option.id }
            selected={ option.id === event.id }
            component={ AdapterLink }
            to={ `/${option.id}` }
          >
            {option.year}: {option.name}
          </MenuItem>
        )) }
      </Menu>
    </ThemeProvider>
  );

  return (
    <React.Fragment>
      <Hidden mdUp>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={ handleDrawerOpen }
              className={ classes.menuButton }
            >
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="h6" noWrap>
              { event.name }
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={ classes.drawer }>
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant='temporary'
            disableBackdropTransition={ !iOS }
            disableDiscovery={ iOS }
            open={ drawerOpen }
            onOpen={ handleDrawerOpen }
            onClose={ handleDrawerClose }
            classes={ { paper: classes.drawerPaper } }
            ModalProps={ { keepMounted: true /* Better open performance on mobile */ } }
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            classes={ { paper: classes.drawerPaper } }
            ModalProps={ { keepMounted: true /* Better open performance on mobile */ } }
            open
          >
            { drawer }
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>
  );
};

Header.propTypes = {
  event: PropTypes.object,
  allEvents: PropTypes.array,
  navigation: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string,
        disabled: PropTypes.bool
      })
    )
  ).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Header);
