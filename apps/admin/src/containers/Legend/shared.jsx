import React from 'react';
import PropTypes from 'prop-types';

export const LegendTitle = ({ record }) => (
  <span>Legenda: {record ? `"${record.title}"` : ''}</span>
);

LegendTitle.propTypes = {
  record: PropTypes.object.isRequired
};
