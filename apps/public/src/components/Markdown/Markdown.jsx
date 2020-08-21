import React from 'react';
import PropTypes from 'prop-types';
import BaseMarkdown from 'markdown-to-jsx';
import { Typography } from '@material-ui/core';

const overrides = {
  h1: {
    component: Typography,
    props: {
      variant: 'h5',
      component: 'h2',
      gutterBottom: true
    }
  },
  h2: {
    component: Typography,
    props: {
      variant: 'h6',
      component: 'h3',
      gutterBottom: true
    }
  },
  h3: {
    component: Typography,
    props: {
      variant: 'h6',
      component: 'h4',
      gutterBottom: true
    }
  },
  p: {
    component: Typography,
    props: {
      variant: 'body1',
      style: { marginBottom: '1.2em' }
    }
  },
  li: {
    component: Typography,
    props: {
      variant: 'body1',
      component: 'li'
    }
  },
  pre: {
    component: Typography,
    props: {
      variant: 'body1',
      component: 'pre',
      fontFamily: 'Monospace',
      style: { marginLeft: '2em', marginBottom: '2em', overflowX: 'auto' }
    }
  }
};

const Markdown = ({ content = '', options, ...props }) => (
  <BaseMarkdown
    options={ {
      overrides,
      forceBlock: true,
      ...options
    } }
    { ...props }
  >
    { content || '' }
  </BaseMarkdown>
);

Markdown.propTypes = {
  content: PropTypes.string,
  options: PropTypes.object
};

export default Markdown;
