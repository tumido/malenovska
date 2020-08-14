import React from 'react';
import PropTypes from 'prop-types';

import { Container, Grid, Card } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop } from 'components';

const Article = ({ scrollTop = true, children }) => {
  if (!children) {
    return '';
  }

  return (
    <Container maxWidth='md'>
      <Grid container spacing={ 2 }>
        <Card>
          { children }
        </Card>
      </Grid>
      { scrollTop && <ScrollTop anchor='#top' /> }
    </Container>

  );
};

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node
};

export default Article;
