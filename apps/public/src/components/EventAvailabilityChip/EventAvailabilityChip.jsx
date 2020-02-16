import React from 'react';
import PropTypes from 'prop-types';

import { Chip, Icon, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

// FIXME: remove when released MUI with https://github.com/mui-org/material-ui/pull/17469
import clsx from 'clsx';

const styles = {
  avatar: {
    height: 32,
    width: 32
  },
  avatarPrimary: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(175, 175, 175)'
  },
  avatarSecondary: {
    color: '#fff',
    backgroundColor: '#dd2c00'
  }
};

const EventAvailabilityChip = ({ event, className, classes }) => (
  (!event.times || !event.times.date || event.times.date.toDate() < new Date()) ? (
    <Chip
      className={ className }
      color='primary'
      label='Proběhlo'
      avatar={ <Avatar className={ clsx(`${classes.avatar} ${classes.avatarPrimary}`) }><Icon>hourglass_empty</Icon></Avatar> }
    />
  ) : (
    <Chip
      className={ className }
      label='Nová akce'
      color='secondary'
      avatar={ <Avatar className={ clsx(`${classes.avatar} ${classes.avatarSecondary}`) }><Icon>favorite_border</Icon></Avatar> }
    />
  )
);

EventAvailabilityChip.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EventAvailabilityChip);
