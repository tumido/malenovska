import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Chip, Box, CardContent, IconButton, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ShareOutlined } from '@material-ui/icons';

import { Markdown, Article, ArticleCardHeader } from 'components';
import { timestampToDateStr } from '../../utilities/firebase';
import { ShareDialog } from '../../components';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

const Show = ({ match: { params: { id }}, event }) => {
  const classes = useStyles();
  const [ shareDialogOpen, setShareDialogOpen ] = React.useState(false);

  useFirestoreConnect(() => ([
    {
      collection: 'legends',
      doc: id,
      storeAs: id
    }
  ]));
  const legend = useSelector(({ firestore }) => firestore.ordered[id]);

  if (!isLoaded(legend)) {
    return <Article />;
  }

  if (!legend.length || legend[0].event !== event.id) {
    return <Redirect to='/not-found' />;
  }

  return (
    <Article>
      <ArticleCardHeader image={ legend[0].image && legend[0].image.src } title={ legend[0].title } />
      <CardContent>
        <Chip
          label={ event.name }
          variant='outlined'
          className={ classes.margin }
          to={ `/${event.id}` }
          component={ Link }
          clickable
        />
        { legend[0].published_at && (
          <Chip
            label={ timestampToDateStr(legend[0].published_at) }
            variant='outlined'
            className={ classes.margin }
          />
        )}
        <Box className={ classes.margin }>
          <Markdown content={ legend[0].content } />
        </Box>
      </CardContent>
      <CardActions>
        {/* <IconButton aria-label="add to favorites">
              <FavoriteOutlined />
            </IconButton> */}
        <IconButton aria-label="share" onClick={ ()=> setShareDialogOpen(true) }>
          <ShareOutlined />
        </IconButton>
      </CardActions>
      <ShareDialog
        open={ shareDialogOpen }
        onClose={ () => setShareDialogOpen(false) }
        title={ legend[0].title }
        eventName={ event.name }
      />
    </Article>
  );
};

Show.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(Show);
