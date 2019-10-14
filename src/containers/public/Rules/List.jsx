import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

import { Article, ArticleMedia, Markdown } from 'components';

const List = ({ event }) => (
  <Article isLoading={ !event }>
    <Typography gutterBottom variant='h4' component='h2' id='top'>Pravidla: { event.name } { event.year }</Typography>
    <ArticleMedia src={ event.rules_image && event.rules_image.src } />
    <Markdown content={ event.rules } />
  </Article>
);

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
