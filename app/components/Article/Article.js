import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const Article = ( {title, content} ) => {
  const parList = Object.keys(content).map((i) =>
    <p className="title" key={i}>{content[i]}</p>
  )

  return (
    <article className="article">
        <h1 className="title">{ title }</h1>
        { parList }
    </article>
  )
  };

Article.prototype = {
  title: PropTypes.string,
  content: PropTypes.string
}

export default Article;
