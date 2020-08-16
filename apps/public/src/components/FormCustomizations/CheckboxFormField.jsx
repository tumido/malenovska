import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@material-ui/core';

const CheckboxFormField = ({ input, label, required, meta: { touched, error }, ...extra }) => (
  <FormControl error={ Boolean(touched && error) } >
    <FormControlLabel
      control={ <Checkbox
        { ...input }
        checked={ input.checked }
        { ...extra }/> }
      label={ label }
      labelPlacement='bottom' />
    { touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

CheckboxFormField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any
  }),
  extra: PropTypes.object
};

export default CheckboxFormField;
