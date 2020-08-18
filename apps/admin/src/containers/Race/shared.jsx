import React from 'react';
import PropTypes from 'prop-types';

export const RaceTitle = ({ record }) => (
  <span>Strana: { record ? `"${record.name}"` : '' }</span>
);

RaceTitle.propTypes = {
  record: PropTypes.object
};
