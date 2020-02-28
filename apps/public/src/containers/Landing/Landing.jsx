import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import { Hidden, Grid, Typography, Card, CardActionArea, CardContent, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import BgImage from '@malenovska/common/assets/images/background.jpg';

import { darkTheme } from '../../utilities/theme';
import { Logo, EventAvailabilityChip, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  h1: {
    fontWeight: 600,
    fontSize: '9rem'
  },
  root: {
    minHeight: '100vh',
    background: `url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: 'cover'
  },
  logo: {
    color: '#fff'
  },
  eventList: {
    [theme.breakpoints.up('md')]: {
      minHeight: '100vh'
    },
    backgroundColor: 'rgba(0, 0, 0, .75)',
    margin: 0
  },
  event: {
    minWidth: '100%'
  },
  chip: {
    float: 'right',
    marginLeft: theme.spacing(1)
  }
}));

const EventItem = ({ event }) => {
  const classes = useStyles();

  return (
    <Grid item key={ `item_${event.id}` } className={ classes.event }>
      <Link component={ RouterLink } underline='none' to={ event.id }>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5">
                { event.name }
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                { event.type ? 'Bitva, podzim' : 'Šarvátka, jaro' } { event.year }
              </Typography>
              <Markdown content={ event.description } />
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
};

EventItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
  }).isRequired
};

const Landing = ({ events }) => {
  const classes = useStyles();
  const today = new Date();

  return (
    <ThemeProvider theme={ darkTheme }>
      <Grid container justify="center" alignItems="stretch" className={ classes.root }>
        <Hidden xsDown>
          <Grid item xs={ 12 } md={ 9 } container direction="column" justify="center" alignItems="center" className={ classes.logo }>
            <Typography gutterBottom variant="h1" className={ classes.h1 }>
              Malen
              <Logo size='5rem' bgColor={ darkTheme.palette.text.primary } fgColor='#000' />
              vská
            </Typography>
            <Typography variant="body1">Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajímá.</Typography>
          </Grid>
        </Hidden>
        <Grid item xs={ 12 } md={ 3 } container spacing={ 4 } direction="column" justify="center" alignItems="center" className={ classes.eventList }>
          { isLoaded(events) && events
          .filter(({ date }) => date.toDate && date.toDate() >= today)
          .sort((a, b) => a.date < b.date ? 1 : -1)
          .map((event) => <EventItem key={ event.id } event={ event } />)}
          <Typography variant="overline" color="textSecondary">Již proběhlo</Typography>
          { isLoaded(events) && events
          .filter(({ date }) => date.toDate && date.toDate() < today)
          .sort((a, b) => a.date < b.date ? 1 : -1)
          .map((event) => <EventItem key={ event.id } event={ event } />)}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

Landing.propTypes = {
  events: PropTypes.array
};

export default compose(
  firestoreConnect(() => ([
    {
      collection: 'events',
      where: ['display', '==', true]
    }
  ])),
  connect(state => ({
    events: state.firestore.ordered.events
  }))
)(Landing);
