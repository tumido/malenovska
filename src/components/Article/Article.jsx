import React from 'react';
import PropTypes from 'prop-types';

import { Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ArticleContent, ArticleMedia, ScrollTop } from 'components';

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

const Article = ({ scrollTop = true, isLoading = false, children }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container className={ classes.root }>
        <Paper className={ classes.paper }>
          { !isLoading ? children : (
            <React.Fragment>
              <ArticleContent>
                <Typography gutterBottom variant='h4' component='h1'>
                  <Skeleton type='text' width={ 400 } />
                </Typography>
              </ArticleContent>
              <ArticleMedia />
              <ArticleContent>
                { Array.from({ length: 5 }).map((_, i) => <Skeleton key={ `skeleton_${i}` } type='text' />) }
                <Skeleton type='text' width='30%' />
              </ArticleContent>
            </React.Fragment>
          )}
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
