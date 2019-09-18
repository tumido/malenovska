import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { Typography } from '@material-ui/core';

const Readout = ({ races, selectedRace }) => {
  const race = races.filter(({ id }) => id === selectedRace)[0];

  return (
    <React.Fragment>
      <Typography variant='h4'>
        { race.name }
      </Typography>
      <Typography variant='body1'>
        { race.legend }
      </Typography>
    </React.Fragment>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  selectedRace: PropTypes.string.isRequired
};

export default formValues({ selectedRace: 'race' })(Readout);
