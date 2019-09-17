import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import { Hidden, Grid, Typography, Card, CardActionArea, CardContent, Link } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { Logo } from 'components';
import BgImage from '../../../assets/images/background.jpg';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const styles = makeStyles({
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
  }
});

const LandingPage = ({ events }) => {
  const classes = styles();

  return (
    <ThemeProvider theme={ theme }>
      <Grid container justify="center" alignItems="stretch" className={ classes.root }>
        <Hidden xsDown>
          <Grid item xs={ 12 } md={ 9 } container direction="column" justify="center" alignItems="center" className={ classes.logo }>
            <Typography gutterBottom variant="h1" className={ classes.h1 }>
              Malen
              <Logo size='5rem' bgColor={ theme.palette.text.primary } fgColor='#000' />
              vská
            </Typography>
            <Typography variant="body1">Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajíma.</Typography>
          </Grid>
        </Hidden>
        <Grid item xs={ 12 } md={ 3 } container spacing={ 4 } direction="column" justify="center" alignItems="center" className={ classes.eventList }>
          { isLoaded(events) && events.filter(({ display }) => display).map((event) => (
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
                      <Typography variant="body2">
                        { event.description }
                      </Typography>
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

LandingPage.propTypes = {
  events: PropTypes.array
};

export default compose(
  firestoreConnect(() => ([
    { collection: 'events' }
  ])),
  connect(state => ({
    events: state.firestore.ordered.events
  }))
)(LandingPage);
