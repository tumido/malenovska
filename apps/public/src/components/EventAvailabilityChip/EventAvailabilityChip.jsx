import React from 'react';
import PropTypes from 'prop-types';

import { Chip, Icon } from '@material-ui/core';

const EventAvailabilityChip = ({ event, className }) => (
  (!event.date || !event.date.toDate || event.date.toDate() < new Date()) ? (
    <Chip
      className={ className }
      color='primary'
      label='Proběhlo'
      icon={ <Icon>hourglass_empty</Icon> }
    />
  ) : (
    <Chip
      className={ className }
      label='Nová akce'
      color='secondary'
      icon={ <Icon>favorite_border</Icon> }
    />
  )
);

EventAvailabilityChip.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default EventAvailabilityChip;
