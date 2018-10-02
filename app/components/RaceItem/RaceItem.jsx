import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const RaceItem = ({name, count, limit, onClick, className}) => (
  <a className={"RaceItem " + className} onClick={onClick}>
    {name} <span>({count}/{limit})</span>
  </a>
);

RaceItem.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number,
  limit: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default RaceItem;
