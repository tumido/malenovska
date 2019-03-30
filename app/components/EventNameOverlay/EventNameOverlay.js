import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const EventNameOverlay = ({title}) => (
  <header className="EventNameOverlay custom-font">
    <h1>{title}</h1>
  </header>
);

EventNameOverlay.propTypes = {
  title: PropTypes.string
}

export default EventNameOverlay;
