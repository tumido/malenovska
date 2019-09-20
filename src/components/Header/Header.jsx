import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Hidden, Drawer, Toolbar, Typography, IconButton, Divider, List,
  ListItem, ListItemText, ListItemIcon, Menu, MenuItem, Link, Icon
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

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
    backgroundColor: theme.palette.primary.light,
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
    [
      {
        textPrimary: 'Legendy a příběhy',
        icon: 'speaker_notes',
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
        icon: 'mail_outline'
      }
    ],
    [
      {
        textPrimary: 'Nová registrace',
        icon: 'person_add',
        href: 'registration/new'
      },
      {
        textPrimary: 'Účastníci',
        icon: 'how_to_reg',
        href: 'registration/list'
      }
    ]
  ];

  const drawer = (
    <React.Fragment>
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
              <Link key={ `item_${index}`  } component={ RouterLink } underline='none' color='inherit' to={ `/${event.id}/${item.href}` }>
                <ListItem button>
                  <ListItemIcon><Icon className={ classes.icon }>{ item.icon }</Icon></ListItemIcon>
                  <ListItemText primary={ item.textPrimary } />
                </ListItem>
              </Link>
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
            onClose={ handleDrawerToggle }
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
  allEvents: PropTypes.array
};

export default Header;
