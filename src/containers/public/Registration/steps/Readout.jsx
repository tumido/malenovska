import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';

import { Typography, Chip, Container, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { ScrollTop, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  image: {
    height: 400,
    width: '100%',
    objectFit: 'cover'
  },
  chip: {
    margin: theme.spacing(1)
  },
  legend: {
    [theme.breakpoints.up('md')]: {
      marginTop: 40
    }
  }
}));

const Readout = ({ races, selectedRace, participants }) => {
  const classes = useStyles();
  const race = races.filter(({ id }) => id === selectedRace)[0];

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <Typography gutterBottom variant='h5' component='h2' id='top'>
          { race.name }
          <Chip label={ `${participants.filter(p => p.race === selectedRace).length} / ${race.limit}` } className={ classes.chip } />
        </Typography>
        <Typography gutterBottom variant='subtitle1'>
          Každá strana žije svůj příběh. Má svůj boj, svůj cíl...
        </Typography>
      </Container>
      <img className={ classes.image } src={ race.image && race.image.src } />
      <Container maxWidth='md' className={ classes.legend }>
        <Markdown content={ race.legend } />
      </Container>
      <Hidden smDown>
        <ScrollTop anchor='#top' />
      </Hidden>
    </React.Fragment>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  selectedRace: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired
};

export default formValues({ selectedRace: 'race' })(Readout);
