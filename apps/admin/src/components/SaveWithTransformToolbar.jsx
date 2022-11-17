import React from "react";
import PropTypes from "prop-types";
import { Toolbar, SaveButton } from "react-admin";

const SaveWithTransformToolbar = ({ transform, ...props }) => (
  <Toolbar {...props}>
    <SaveButton type="button" transform={transform}/>
  </Toolbar>
);

SaveWithTransformToolbar.propTypes = {
  transform: PropTypes.func.isRequired,
  mutationOptions: PropTypes.object,
};

export default SaveWithTransformToolbar;
