import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';

import { Typography, Chip, CardContent, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  }
}));

const Readout = ({ races, selectedRace, participants }) => {
  const classes = useStyles();
  const race = races.filter(({ id }) => id === selectedRace)[0];

  return (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom variant='h4' component='h2'>
          { race.name }
          <Chip label={ `${participants.filter(p => p.race === selectedRace).length} / ${race.limit}` } className={ classes.chip } />
        </Typography>
        <Typography variant='subtitle1'>
          Každá strana žije svůj příběh. Má svůj boj, svůj cíl...
        </Typography>
      </CardContent>
      <CardMedia style={ { height: 400 } } image={ race.image && race.image.src } />
      <CardContent>
        <Markdown content={ race.legend } />
      </CardContent>
    </React.Fragment>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  selectedRace: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired
};

export default formValues({ selectedRace: 'race' })(Readout);
