import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: 'left',
    width: '100%'
  },
  image: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    height: 100,
    width: 200
  }
});

const ArticlePreview = ({ article, className, href }) => {
  const classes = useStyles();

  if (!article) {
    return (
      <Grid container className={ classes.root } spacing={ 2 }>
        <Grid item>
          <Skeleton variant="rect" height={ 100 } width={ 200 } className={ classes.image }/>
        </Grid>
        <Grid item xs={ 12 } sm container direction="column" alignItems='flex-start' justify='flex-start' spacing={ 2 }>
          <Grid item>
            <Skeleton variant="rect" height='2em' width={ 200 }/>
          </Grid>
          <Grid item>
            <Skeleton variant="rect" height='1em' width={ 450 }/>
          </Grid>
          <Grid item>
            <Skeleton variant="rect" height='1em' width={ 400 }/>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  const { title, content, perex } = article;

  return (
    <ButtonBase component={ RouterLink } to={ href } className={ classes.root }>
      <Grid container className={ className } spacing={ 2 }>
        <Grid item>
          { article.image ? (
            <img className={ classes.image } src={ article.image.src } />
          ) : (
            <Skeleton variant="rect" className={ classes.image }/>
          ) }
        </Grid>
        <Grid item xs={ 12 } sm container direction="column" alignItems='flex-start' justify='flex-start' spacing={ 2 }>
          <Grid item>
            <Typography gutterBottom variant='h6'>{ title }</Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant='body1'>{ perex || content.split('\n')[0] }</Typography>
          </Grid>
        </Grid>
      </Grid>
    </ButtonBase>
  );
};

ArticlePreview.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    published_at: PropTypes.any,  // eslint-disable-line camelcase
    perex: PropTypes.string,
    image: PropTypes.shape({
      src: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  }),
  href: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

export default ArticlePreview;

