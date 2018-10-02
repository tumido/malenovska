import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const ListItem = (props) => (
  <li className="list-item">{props.item}</li>
);

ListItem.propTypes = {
  item: PropTypes.any
};

export default ListItem;
