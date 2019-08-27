import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const List = ({ component = 'ul', items}) => {
  const ComponentToRender = component;
  return (
    <ComponentToRender className="List">
      {items}
    </ComponentToRender>
  );
};

List.propTypes = {
  component: PropTypes.string || PropTypes.func,
  items: PropTypes.array,
};

export default List;
