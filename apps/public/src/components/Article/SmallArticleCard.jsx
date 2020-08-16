import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { Card, CardActionArea, CardContent, Typography, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ArticleCardHeader } from 'components';

const SmallArticleCard = ({ title, body, image, href, actionAreaProps = {}, cardProps = {}}) => (
  <CardActionArea component={ href && RouterLink } to={ href } { ...actionAreaProps }>
    <Card component={ Box } width='100%' height='100%' { ...cardProps }>
      <ArticleCardHeader height={ 250 } titleVariant='h5' image={ image && image.src } title={ title }/>
      { body && (
        <CardContent>
          <Typography variant="body2" color="textPrimary" component="p">
            { body }
          </Typography>
        </CardContent>
      )}
      { (!title || !image) && (
        <CardContent>
          <React.Fragment>
            <Typography gutterBottom variant="h5" component="h2">
              <Skeleton variant="text" width={ 200 }/>
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width={ 30 }/>
            </Typography>
          </React.Fragment>
        </CardContent>
      )}
    </Card>
  </CardActionArea>
);

SmallArticleCard.propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  body: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired
  }),
  href: PropTypes.string,
  actionAreaProps: PropTypes.object,
  cardProps: PropTypes.object
};

export default SmallArticleCard;

