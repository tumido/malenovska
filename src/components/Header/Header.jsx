import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import {
  AppBar, Hidden, Drawer, Toolbar, Typography, IconButton, Divider, List,
  ListItem, ListItemText, ListItemIcon, Menu, MenuItem, Icon
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { ThemeProvider } from '@material-ui/styles';
import { darkTheme } from 'utilities/theme';

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

// eslint-disable-next-line react/display-name
const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ ref } { ...props } />);

const Header = ({ event, allEvents, location: { pathname }}) => {
  const classes = useStyles();

  const [ drawerOpen, setDrawerOpen ] = React.useState(false);
  const [ menuOpen, setMenuOpen ] = React.useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
  };

  const drawerItems = [
    [
      {
        textPrimary: 'Legendy a příběhy',
        icon: 'receipt',
        href: 'legends'
      },
      {
        textPrimary: 'Pravidla',
        icon: 'gavel',
        href: 'rules'
      },
      {
        textPrimary: 'Svět',
        icon: 'map'
      },
      {
        textPrimary: 'Důležité informace',
        icon: 'location_on',
        href: 'info'
      },
      {
        textPrimary: 'Kontakty',
        icon: 'mail_outline',
        href: 'contacts'
      },
      {
        textPrimary: 'Galerie',
        className: 'material-icons-outlined',
        icon: 'collections_outline'
      }
    ],
    [
      {
        textPrimary: 'Nová registrace',
        icon: 'person_add',
        href: 'registration/new',
        disabled: !event.registrationAvailable
      },
      {
        textPrimary: 'Účastníci',
        icon: 'how_to_reg',
        href: 'registration/list'
      }
    ]
  ];

  const drawer = (
    <ThemeProvider theme={ darkTheme }>
      <div className={ classes.drawerHeader }>
        <Hidden mdUp>
          <IconButton onClick={ handleDrawerToggle }>
            <Icon className={ classes.faIcon }>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </div>
      { drawerItems.map((section, index) => (
        <React.Fragment key={ `sec_${index}` }>
          <List>
            { section.map((item, index) => (
              <ListItem
                key={ `item_${index}`  }
                button
                selected={ `/${event.id}/${item.href}` === pathname }
                disabled={ !item.href || item.disabled }
                to={ `/${event.id}/${item.href}` }
                component={ AdapterLink }
              >
                <ListItemIcon><Icon className={ clsx(`${classes.icon}, ${item.className}`) }>{ item.icon }</Icon></ListItemIcon>
                <ListItemText primary={ item.textPrimary } />
              </ListItem>
            )) }
          </List>
          <Divider className={ classes.drawerDivider }/>
        </React.Fragment>
      )) }
      <List component="nav" aria-label="Device settings">
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
        onClose={ handleMenuClose }
      >
        { allEvents.filter(({ display }) => display).map(option => (
          <MenuItem
            key={ option.id }
            selected={ option.id === event.id }
            component={ AdapterLink }
            to={ `/${option.id}` }
          >
            {option.name}
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
        <Hidden mdUp implementation="css">
          <Drawer
            variant='temporary'
            open={ drawerOpen }
            onClick={ handleDrawerToggle }
            classes={ { paper: classes.drawerPaper } }
            ModalProps={ { keepMounted: true /* Better open performance on mobile */ } }
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
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
  allEvents: PropTypes.array,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Header);
