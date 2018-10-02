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
  component: PropTypes.string.isRequired || PropTypes.func.isRequired,
  items: PropTypes.array,
};

export default List;
