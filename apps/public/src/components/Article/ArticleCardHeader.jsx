import React from 'react';
import PropTypes from 'prop-types';
import { Box, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  image: {
    height: ({ height = 400 }) => height
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
    paddingTop: theme.spacing(3)
  }
}));

const ArticleCardHeader = ({ image, title, height, titleVariant = 'h4' }) => {
  const styles = useStyles({ height });

  if (!title) {
    return <Typography variant={ titleVariant } component='h2'><Skeleton variant='text' width="30%"/></Typography>;
  }

  if (!image) {
    return <Typography variant={ titleVariant } component='h2'>{ title }</Typography>;
  }

  return (
    <Box className={ styles.relative }>
      <CardMedia className={ styles.image } image={ image } />
      <Typography className={ styles.title } variant={ titleVariant } component='h2'>{ title }</Typography>
    </Box>
  );
};

ArticleCardHeader.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  height: PropTypes.number,
  titleVariant: PropTypes.string
};

export default ArticleCardHeader;
