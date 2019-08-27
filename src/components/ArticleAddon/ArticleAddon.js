import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Tooltip from 'components/Tooltip';

const ArticleAddon = ({ tooltip = "", icon="fas fa-exclamation"  }) => (
  <div className="ArticleAddon">
    <Tooltip text={tooltip} >
      <div className="addon--container">
        <i className={icon}></i>
      </div>
    </Tooltip>
  </div>
);

ArticleAddon.propTypes = {
  tooltip: PropTypes.string,
  icon: PropTypes.string,
}

export default ArticleAddon;
