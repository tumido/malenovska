import React from 'react';
import PropTypes from 'prop-types';
import { Box, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  image: {
    height: 400
  },
  relative: {
    position: 'relative'
  },
  title: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
  }
}));

const ArticleHeader = ({ image, title }) => {
  const styles = useStyles();

  if (!title) {
    return <Typography variant='h4' component='h1'><Skeleton variant='text' width="30%"/></Typography>;
  }

  if (!image) {
    return <Typography variant='h4' component='h1'>{ title }</Typography>;
  }

  return (
    <Box className={ styles.relative }>
      <CardMedia className={ styles.image } image={ image } />
      <Typography className={ styles.title } variant='h4' component='h1'>{ title }</Typography>
    </Box>
  );
};

ArticleHeader.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default ArticleHeader;
