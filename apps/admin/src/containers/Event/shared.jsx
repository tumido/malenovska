import React from 'react';
import PropTypes from 'prop-types';

import { Chip } from '@material-ui/core';

export const EventTitle = ({ record }) => {
  return <span>Událost: {record ? `"${record.name}"` : ''}</span>;
};

EventTitle.propTypes = {
  record: PropTypes.object
};

export const ChipField = ({ record }) => <Chip label={ record.name } />;

ChipField.propTypes = {
  record: PropTypes.object.isRequired
};
