import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, SaveButton } from 'react-admin';

const SaveWithTransformToolbar = ({ transform, ...props }) => (
  <Toolbar { ...props }>
    <SaveButton transform={ transform } />
  </Toolbar>
);

SaveWithTransformToolbar.propTypes = {
  transform: PropTypes.func.isRequired
};

export default SaveWithTransformToolbar;
