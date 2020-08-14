import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Typography, Chip, Box, CardMedia, CardContent, Container, Card, Grid, IconButton, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ShareOutlined, FavoriteOutlined } from '@material-ui/icons';

import { Article, ArticleContent, ArticleMedia, Markdown } from 'components';
import { timestampToDateStr } from '../../utilities/firebase';
import { ShareDialog } from '../../components';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  },
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
    // background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 45%)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
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
    return <Article isLoading={ true }/>;
  }

  if (!legend.length || legend[0].event !== event.id) {
    return <Redirect to='/not-found' />;
  }

  return (
    <Container maxWidth='md'>
      <Grid container spacing={ 2 }>
        <Card>
          <Box className={ classes.relative }>
            <CardMedia className={ classes.image } image={ legend[0].image && legend[0].image.src } />
            <Typography className={ classes.title } variant='h4' component='h1'>{ legend[0].title }</Typography>
          </Box>
          <Chip
            label={ event.name }
            variant='outlined'
            className={ classes.chip }
            to={ `/${event.id}` }
            component={ Link }
            clickable
          />
          { legend[0].published_at && (
            <Chip
              label={ timestampToDateStr(legend[0].published_at) }
              variant='outlined'
              className={ classes.chip }
            />
          )}
          <CardContent>
            <Markdown content={ legend[0].content } />
          </CardContent>
          <CardActions>
            {/* <IconButton aria-label="add to favorites">
              <FavoriteOutlined />
            </IconButton> */}
            <IconButton aria-label="share" onClick={ ()=> setShareDialogOpen(true) }>
              <ShareOutlined />
            </IconButton>
          </CardActions>
        </Card>
        <ShareDialog
          open={ shareDialogOpen }
          onClose={ () => setShareDialogOpen(false) }
          title={ legend[0].title }
          eventName={ event.name }
        />
      </Grid>
    </Container>
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
