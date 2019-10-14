import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@material-ui/core';

const ArticleContent = ({ children }) => (
  <Container maxWidth='md'>
    { children }
  </Container>
);

ArticleContent.propTypes = {
  children: PropTypes.node
};

export default ArticleContent;
