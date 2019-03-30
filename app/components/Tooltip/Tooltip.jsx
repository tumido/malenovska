import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Tooltip = ( {children, text} ) => (
    <div className="Tooltip">
        <div className="tooltip--hoverarea">{ children }</div>
        <div className="tooltip--content">{ text }</div>
    </div>
)

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired
}

export default Tooltip;
