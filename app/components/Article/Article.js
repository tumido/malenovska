import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './style.scss';
import trucate from 'lodash/truncate'
import sample from 'lodash/sample'

const Article = ( {title, content="", trucated, trucateSettings, ...props} ) => {
  const selfLink = props.id
    ? <a href={`#${props.id}`} className="self-link"><i className="fas fa-link"></i></a>
    : ""

  content = content.replace(/\\n/g,'\n')
  let settings = trucateSettings ? trucateSettings : {'length': 300, 'separator': ' '}
  let displayContent = trucated
    ? trucate(content, settings)
    : content

  const buttonTexts = [
    "Chci číst víc!", "Ukaž to!", "Odhal zbytek tajemství!", "Pokračuj, plantážníku..."
  ]

  const expandOverlay = trucated
    ? <div onClick={toggleContent} className="toggle-content"><i className="fas fa-expand-arrows-alt"></i></div>
    : ""
    // {/* <h1>{sample(buttonTexts)}</h1> */}

  const toggleContent = () => {
    displayContent = content;
  }

  return (
    <article className="article custom-font" {...props}>
        { selfLink }
        <h1>{ title }</h1>
        <ReactMarkdown source={displayContent} />
        { expandOverlay }
    </article>
  )
  };

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  trucated: PropTypes.bool,
  trucateSettings: PropTypes.shape({
    'length': PropTypes.number,
    'separator': PropTypes.string,
  })
}

export default Article;
