import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import { Hidden, Grid, Typography, Card, CardActionArea, CardContent, Link, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ExpandMore } from '@material-ui/icons';

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
  );
};

EventItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired
  }).isRequired
};

const cmpDate = (a, b) => a.date < b.date ? 1 : -1;
const getYear = date => date && date.toDate && date.toDate().getFullYear() || 0;
const cmpYear = (year, today) => year === today.getFullYear();

const Landing = ({ events }) => {
  const classes = useStyles();
  const today = new Date();

  const thisYear = (!isLoaded(events)) ? [] : events
  .filter(({ date, display }) => display && cmpYear(getYear(date), today))
  .sort(cmpDate);

  const pastYears = (!isLoaded(events)) ? [] : events
  .filter(({ date, display }) => display && (!cmpYear(getYear(date), today)))
  .sort(cmpDate);

  const [ expanded, setExpanded ] = React.useState(false);

  const renderPast = expanded ? (
    <React.Fragment>
      <Typography variant="overline" color="textSecondary">V letech minulých</Typography>
      { pastYears.map((event) => <EventItem key={ event.id } event={ event } />)}
    </React.Fragment>
  ) : (
    <Button onClick={ () => setExpanded(true) } startIcon={ <ExpandMore /> } variant='outlined' size='small'>Zobraz minulé ročníky</Button>
  );

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
          <Typography variant="overline" color="textSecondary">Malenovské události roku {today.getFullYear()}</Typography>
          { thisYear.map((event) => <EventItem key={ event.id } event={ event } />)}
          { renderPast }
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
      where: [ 'display', '==', true ]
    }
  ])),
  connect(state => ({
    events: state.firestore.ordered.events
  }))
)(Landing);
