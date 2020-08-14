import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import { ArticleCardHeader } from 'components';

const useStyles = makeStyles({
  fullHeight: {
    height: '100%'
  }
});

const SmallArticleCard = ({ title, body, image, href }) => {
  const classes = useStyles();

  if (!title || !image || !href) {
    return (
      <Card >
        <ArticleCardHeader height={ 250 }/>
        <CardContent className={ classes.text }>
          <Typography gutterBottom variant="h5" component="h2">
            <Skeleton variant="text" width={ 200 }/>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width={ 30 }/>
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <CardActionArea component={ RouterLink } to={ href }>
      <Card className={ classes.fullHeight }>
        <ArticleCardHeader height={ 250 } titleVariant='h5' image={ image.src } title={ title }/>
        <CardContent className={ classes.text }>
          <Typography variant="body2" color="textSecondary" component="p">
            { body }
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

SmallArticleCard.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }),
  href: PropTypes.string
};

export default SmallArticleCard;

