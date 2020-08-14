import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { CardContent, CardActions, IconButton, Fab, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article, ArticleCardHeader, Markdown, ShareDialog } from 'components';
import { ShareOutlined, PaletteOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
  colorFab: ({ color }) => ({
    background: color,
    color: 'white',
    float: 'right',
    '&:hover': {
      background: color
    }
  }),
  colorBadge: ({ color }) => ({
    backgroundColor: color,
    display: 'box',
    textAlign: 'center',
    height: 16,
    width: '100%',
    color: 'white'
  })
});

const ColorFab = ({ color }) => {
  const styles = useStyles({ color });

  return (
    <Fab className={ styles.colorFab } component='div' >
      <PaletteOutlined/>
    </Fab>
  );
};

ColorFab.propTypes = {
  color: PropTypes.string.isRequired
};

const ColorBadge = ({ color }) => {
  const styles = useStyles({ color });

  return !color ? null : (<Box className={ styles.colorBadge } />);
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

const Show = ({ match: { params: { id }}, event }) => {
  const [ shareDialogOpen, setShareDialogOpen ] = React.useState(false);

  useFirestoreConnect(() => ([
    {
      collection: 'races',
      doc: id,
      storeAs: id
    }
  ]));
  const race = useSelector(({ firestore }) => firestore.ordered[id]);

  if (!isLoaded(race)) {
    return <Article />;
  }

  if (!race.length || race[0].event !== event.id) {
    return <Redirect to='/not-found' />;
  }

  return (
    <Article>
      <ColorBadge color={ race[0].color } />
      <ArticleCardHeader image={ race[0].image && race[0].image.src } title={ <React.Fragment>
        {race[0].name}
        <ColorFab color={ race[0].color } />
      </React.Fragment> } />
      <CardContent>
        <Markdown content={ race[0].legend } />
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
        title={ race[0].name }
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
