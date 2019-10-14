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
  paper: ({ spacing }) => ({
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(spacing * 2)
    },
    paddingTop: theme.spacing(spacing),
    paddingBottom: theme.spacing(spacing)
  })
}));

const Article = ({ scrollTop = true, isLoading = false, spacing = 2, children }) => {
  const classes = useStyles({ spacing });

  return (
    <article>
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
    </article>
  );
};

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node
};

export default Article;
