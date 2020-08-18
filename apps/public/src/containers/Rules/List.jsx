import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CardContent } from '@material-ui/core';

import { Article, ArticleCardHeader, Markdown } from 'components';

const List = ({ event }) => (
  <Article>
    <ArticleCardHeader title={ `${event.name} - Pravidla` } image={ event.rulesImage && event.rulesImage.src }/>
    <CardContent>
      <Markdown content={ event.rules } />
    </CardContent>
  </Article>
);

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
