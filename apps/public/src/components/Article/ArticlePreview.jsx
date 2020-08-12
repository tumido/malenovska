import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles({
  media: {
    height: 200
  }
});

const ArticlePreview = ({ article, href }) => {
  const classes = useStyles();

  if (!article) {
    return (
      <Card>
        <CardActionArea>
          <Skeleton variant="rect" height={ 200 }/>
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
        </CardActionArea>
      </Card>
    );
  }

  const { title, content, perex } = article;

  return (
    <Card>
      <CardActionArea component={ RouterLink } to={ href }>
        <CardMedia
          className={ classes.media }
          image={ article.image.src }
        />
        <CardContent className={ classes.text }>
          <Typography gutterBottom variant="h5" component="h2">
            { title }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            { perex || content.split('\n')[0] }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
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
  isLoading: PropTypes.bool
};

export default ArticlePreview;

