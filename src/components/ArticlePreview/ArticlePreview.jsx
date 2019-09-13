import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography, ButtonBase, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: 'left',
    width: '100%'
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%'
  }
});

const ArticlePreview = ({ title, content, className, href, isLoading = false }) => {
  const classes = useStyles();

  if (isLoading) {
    return (
      <Grid container className={ classes.root } spacing={ 2 }>
        <Grid item>
          <Skeleton variant="rect" height={ 100 } width={ 200 } className={ classes.img }/>
        </Grid>
        <Grid item xs={ 12 } sm container direction="column" alignItems='flex-start' justify='flex-start' spacing={ 2 }>
          <Grid item>
            <Skeleton variant="rect" height='2em' width={ 200 } className={ classes.img }/>
          </Grid>
          <Grid item>
            <Skeleton variant="rect" height='1em' width={ 450 } className={ classes.img }/>
          </Grid>
          <Grid item>
            <Skeleton variant="rect" height='1em' width={ 400 } className={ classes.img }/>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <ButtonBase component={ RouterLink } to={ href } className={ classes.root }>
      <Grid container className={ className } spacing={ 2 }>
        <Grid item>
          <Skeleton variant="rect" height={ 100 } width={ 200 } className={ classes.img }/>
        </Grid>
        <Grid item xs={ 12 } sm container direction="column" alignItems='flex-start' justify='flex-start' spacing={ 2 }>
          <Grid item>
            <Typography gutterBottom variant='h6'>{ title }</Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant='body1'>{ content.split('\n')[0] }</Typography>
          </Grid>
        </Grid>
      </Grid>
    </ButtonBase>
  );
};

ArticlePreview.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  href: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

export default ArticlePreview;

