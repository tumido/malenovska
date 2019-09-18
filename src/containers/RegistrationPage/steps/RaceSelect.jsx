import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    { ...input }
    { ...rest }
    onChange={ (event, value) => input.onChange(value) }
  />
);

renderRadioGroup.propTypes = {
  input: PropTypes.object
};

const RaceSelect = ({ races }) => (
  <React.Fragment>
    <Field name='race' component={ renderRadioGroup }>
      {
        races.map(race =>
          <FormControlLabel
            key={ race.id }
            value={ race.id }
            control={ <Radio /> }
            label={ race.name }
          />
        )
      }
    </Field>
  </React.Fragment>
);

RaceSelect.propTypes = {
  races: PropTypes.array.isRequired
};

export default RaceSelect;
