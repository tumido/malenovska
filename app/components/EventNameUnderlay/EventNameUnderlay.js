import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const EventNameUnderlay = ({title}) => (
  <header className="event-name-top custom-font">
    <h1>{title}</h1>
  </header>
);

EventNameUnderlay.propTypes = {
  title: PropTypes.string
}

export default EventNameUnderlay;
