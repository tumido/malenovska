import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const List = (props) => {
  const ComponentToRender = props.component;
  let content = (<div></div>);

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item) => (
      <ComponentToRender key={`item-${item.key}`} item={item} />
    ));
  } else {
    // Otherwise render a single component
    content = (<ComponentToRender />);
  }

  return (
    <ul className="list-wrapper">
      {content}
    </ul>
  );
};

List.propTypes = {
  component: PropTypes.func.isRequired,
  items: PropTypes.array,
};

export default List;
