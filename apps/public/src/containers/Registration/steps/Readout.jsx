import React from 'react';
import PropTypes from 'prop-types';
import { FormSpy } from 'react-final-form';

import { Typography, Chip, CardContent, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  }
}));

const Readout = ({ races, participants }) => {
  const classes = useStyles();

  return (
    <FormSpy subscription={ { values: true } }>
      {({ values }) => {
        const race = races.filter(({ id }) => id === values.race)[0];
        const registeredToRace = participants.filter(p => p.race === values.race).length;

        return (
          <React.Fragment>
            <CardContent>
              <Typography gutterBottom variant='h4' component='h2'>
                { race.name }
                <Chip label={ `${registeredToRace} / ${race.limit}` } className={ classes.chip } />
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
      }}
    </FormSpy>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired
};

export default Readout;
