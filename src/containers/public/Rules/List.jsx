import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

import { Article, ArticleContent, ArticleMedia, Markdown } from 'components';

const List = ({ event }) => (
  <Article isLoading={ !event }>
    <ArticleContent>
      <Typography gutterBottom variant='h4' component='h2'>Pravidla: { event.name } { event.year }</Typography>
    </ArticleContent>
    <ArticleMedia src={ event.rules_image && event.rules_image.src } />
    <ArticleContent><Markdown content={ event.rules } /></ArticleContent>
  </Article>
);

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
