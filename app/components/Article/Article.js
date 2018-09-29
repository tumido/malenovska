import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './style.scss';

const Article = ( {title, content} ) => {
  return (
    <article className="article">
        <h1>{ title }</h1>
        <ReactMarkdown source={content.replace(/\\n/g,'\n')} />
    </article>
  )
  };

Article.prototype = {
  title: PropTypes.string,
  content: PropTypes.string
}

export default Article;
