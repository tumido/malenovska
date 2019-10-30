import React from 'react';
import PropTypes from 'prop-types';

export const ParticipantTitle = ({ record }) => (
  <span>Účastník: { record ? `${record.firstName} "${record.nickName}" ${record.lastName} (${record.event})` : '' }</span>
);

ParticipantTitle.propTypes = {
  record: PropTypes.object.isRequired
};
