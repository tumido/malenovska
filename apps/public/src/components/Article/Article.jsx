import React from 'react';
import PropTypes from 'prop-types';

import { Container, Grid, Card, CardContent } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, ArticleCardHeader } from 'components';

const Article = ({ scrollTop = true, children }) =>  (
  <Container maxWidth='md'>
    <Grid container spacing={ 2 }>
      <Card>
        { children ? children : (
          <React.Fragment>
            <ArticleCardHeader />
            <CardContent>
              <Skeleton variant='text'/>
            </CardContent>
          </React.Fragment>
        ) }
      </Card>
    </Grid>
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
