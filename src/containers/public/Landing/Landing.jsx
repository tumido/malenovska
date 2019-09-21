import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import { Hidden, Grid, Typography, Card, CardActionArea, CardContent, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme } from 'utilities/theme';

import { Logo, EventAvailabilityChip, Markdown } from 'components';
import BgImage from 'assets/images/background.jpg';

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
    minHeight: '100vh',
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

const sortEvents = (a, b) => {
  if (a.year < b.year) { return 1; }

  if (a.year === b.year && a.type < b.type) { return 1; }

  return -1;
};

const Landing = ({ events }) => {
  const classes = useStyles();

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
            <Typography variant="body1">Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajíma.</Typography>
          </Grid>
        </Hidden>
        <Grid item xs={ 12 } md={ 3 } container spacing={ 4 } direction="column" justify="center" alignItems="center" className={ classes.eventList }>
          { isLoaded(events) && events.filter(({ display }) => display).sort(sortEvents).map((event) => (
            <Grid item key={ `item_${event.id}` } className={ classes.event }>
              <Link component={ RouterLink } underline='none' to={ event.id }>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5">
                        { event.name }
                        <EventAvailabilityChip event={ event } className={ classes.chip }/>
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
          ))}
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
    { collection: 'events' }
  ])),
  connect(state => ({
    events: state.firestore.ordered.events
  }))
)(Landing);
