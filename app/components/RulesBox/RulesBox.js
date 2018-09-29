import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './style.scss';

const RulesBox = ( {categoryName, iconClass, content=""} ) => {
  return (
    <section className="rulesBox">
      <div className="box__header">
        <i className={`box__icon ${iconClass}`}></i>
        <h1>{categoryName}</h1>
      </div>
      <ReactMarkdown className="box__content" source={content.replace(/\\n/g,'\n')} />
    </section>
  )
};

RulesBox.prototype = {
  category: PropTypes.string,
  iconClass: PropTypes.string,
  content: PropTypes.string
}

export default RulesBox;
