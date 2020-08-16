import React from 'react';
import PropTypes from 'prop-types';

import { Container, Card, CardContent, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, ArticleCardHeader } from 'components';

const Article = ({ scrollTop = true, children, isLoading = false }) =>  (
  <Container maxWidth='md'>
    <Box width="100%">
      <Card>
        { children && !isLoading ? children : (
          <React.Fragment>
            <ArticleCardHeader />
            <CardContent>
              <Skeleton variant='text'/>
            </CardContent>
          </React.Fragment>
        ) }
      </Card>
    </Box>
    { scrollTop && <ScrollTop anchor='#top' /> }
  </Container>

);

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node
};

export default Article;
