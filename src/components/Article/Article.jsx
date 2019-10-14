import React from 'react';
import PropTypes from 'prop-types';

import { Container, Paper, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ArticleMedia, ScrollTop } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
    paddingTop: 20
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      paddingTop: 40
    },
    paddingTop: 16,
    paddingBottom: 16
  }
}));

const ArticleContent = ({ children }) => (
  <Container maxWidth='md'>
    { children }
  </Container>
);

ArticleContent.propTypes = {
  children: PropTypes.node
};

const Article = ({ scrollTop = true, isLoading = false, children }) => {
  const classes = useStyles();

  const notContentTypes = [ ArticleMedia, Grid, Container ];

  const content = isLoading ? (
    <React.Fragment>
      <ArticleContent>
        <Typography gutterBottom variant='h4' component='h1' id='top'>
          <Skeleton type='text' width={ 400 } />
        </Typography>
      </ArticleContent>
      <ArticleMedia />
      <ArticleContent>
        { Array.from({ length: 5 }).map((_, i) => <Skeleton key={ `skeleton_${i}` } type='text' />) }
        <Skeleton type='text' width='30%' />
      </ArticleContent>
    </React.Fragment>
  ) : React.Children.map(children, c => (
    notContentTypes.includes(c.type) ? c : <ArticleContent>{ c }</ArticleContent>
  ));

  return (
    <React.Fragment>
      <Container className={ classes.root }>
        <Paper className={ classes.paper }>
          { content }
        </Paper>
      </Container>
      { scrollTop && <ScrollTop anchor='#top' /> }
    </React.Fragment>
  );
};

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default Article;
