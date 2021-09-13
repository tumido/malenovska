import React from "react";
import PropTypes from "prop-types";

import { TextField } from "@material-ui/core";

const TextFormField = ({
  input,
  label,
  meta: { touched, error },
  placeholder,
  ...extra
}) => (
  <TextField
    label={label}
    placeholder={placeholder}
    error={Boolean(touched && error)}
    {...input}
    {...extra}
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    helperText={touched && error}
  />
);

TextFormField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any,
  }),
  extra: PropTypes.object,
};

export default TextFormField;
