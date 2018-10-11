import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './style.scss';

const Article = ( {title, content="", ...props} ) => {
  const selfLink = props.id
    ? <a href={`#${props.id}`} className="self-link"><i className="fas fa-link"></i></a>
    : ""
  return (
    <article className="article custom-font" {...props}>
        { selfLink }
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
