import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Tooltip = ( {children} ) => {
  return (
    <div className="Tooltip">
        { children }
    </div>
  )
}

Tooltip.PropTypes = {
  children: PropTypes.element.isRequired
}

export default Tooltip;
