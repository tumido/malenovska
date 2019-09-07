import React from 'react';
import clsx from 'clsx';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  AppBar, Hidden, Drawer, Toolbar, Typography, IconButton, Divider, List,
  ListItem, ListItemText, ListItemIcon, Menu, MenuItem, Link, makeStyles
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { grey } from '@material-ui/core/colors';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  menuButton: {
    marginRight: theme.spacing(2)
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
    backgroundColor: 'rgba(0, 0, 0, .75)',
    color: '#fff'
  },
  drawerSecondary: {
    color: grey[500]
  },
  faIcon: {
    width: '1.5em',
    color: '#fff'
  }
}));

const Header = ({ event, allEvents }) => {
  const classes = useStyles();

  const [ drawerOpen, setDrawerOpen ] = React.useState(false);
  const [ menuOpen, setMenuOpen ] = React.useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  function handleMenuOpen(event) {
    setMenuOpen(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuOpen(null);
  }

  const drawerItems = [
    {
      textPrimary: 'Zprávy z bojiště',
      iconClassName: clsx(classes.faIcon, 'fas fa-book-open')
    },
    {
      textPrimary: 'Pravidla',
      iconClassName: clsx(classes.faIcon, 'fas fa-balance-scale')
    },
    {
      textPrimary: 'Důležité informace',
      iconClassName: clsx(classes.faIcon, 'fas fa-map-marker-alt')
    },
    {
      textPrimary: 'Registrace',
      iconClassName: clsx(classes.faIcon, 'fas fa-address-card')
    },

  ]

  const drawer = (
    <React.Fragment>
      <div className={ classes.drawerHeader }>
        <Hidden smUp>
          <IconButton onClick={ handleDrawerToggle }>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </div>
      <List>
        { drawerItems.map((item, index) => (
          <ListItem key={ `item_${index}` } button>
            <ListItemIcon><Icon className={ item.iconClassName } /></ListItemIcon>
            <ListItemText primary={ item.textPrimary } />
          </ListItem>
        )) }
      </List>
      <Divider />
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={ handleMenuOpen }
        >
          <ListItemText secondaryTypographyProps={ { className: classes.drawerSecondary } } primary="Událost" secondary={ event.name } />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={ menuOpen }
        keepMounted
        open={ Boolean(menuOpen) }
        onClose={ handleMenuClose }
      >
        { allEvents.map(option => (
          <Link key={ option.id } component={ RouterLink } underline='none' color='inherit' to={ `/${option.id}` }>
            <MenuItem selected={ option.id === event.id }>
              {option.name}
            </MenuItem>
          </Link>
        )) }
      </Menu>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Helmet><title>{event.name} {event.year}</title></Helmet>
      <Hidden smUp>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={ handleDrawerToggle }
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
        <Hidden smUp implementation="css">
          <Drawer
            variant='temporary'
            open={ drawerOpen }
            onClose={ handleDrawerToggle }
            classes={ { paper: classes.drawerPaper } }
            ModalProps={ { keepMounted: true /* Better open performance on mobile */ } }
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={ { paper: classes.drawerPaper } } variant="permanent" open>
            { drawer }
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>
  );
};

Header.propTypes = {
  event: PropTypes.object,
  allEvents: PropTypes.array
};

export default Header;
