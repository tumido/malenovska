import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  image: {
    height: 400,
    width: '100%',
    objectFit: 'cover',
    marginTop: '2em',
    marginBottom: '2em'
  }
}));

const ArticleMedia = ({ src }) => {
  const classes = useStyles();

  return src ? (
    <img className={ classes.image } src={ src } />
  ) : (
    <Skeleton variant="rect" height={ 400 } />
  );
};

ArticleMedia.propTypes = {
  src: PropTypes.string
};

export default ArticleMedia;
