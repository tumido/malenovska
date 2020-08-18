import React from 'react';
import PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip';

export const EventTitle = ({ record }) => {
  return <span>Událost: {record ? `"${record.name}"` : ''}</span>;
};

EventTitle.propTypes = {
  record: PropTypes.object
};

export const ChipField = ({ record }) => (
  <React.Fragment>
    { record && <Chip label={ record.name } /> }
  </React.Fragment>
);

ChipField.propTypes = {
  record: PropTypes.object
};
