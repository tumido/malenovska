import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Typography, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article, ArticleContent, ArticleMedia, Markdown } from 'components';
import { timestampToDateStr } from '../../utilities/firebase';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  }
}));

const Show = ({ match: { params: { id }}, event }) => {
  const classes = useStyles();

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
    <Article>
      <ArticleContent>
        <Typography gutterBottom variant='h4' component='h1'>{ legend[0].title }</Typography>
        <Chip label={ event.name } variant='outlined' className={ classes.chip } to={ `/${event.id}` } component={ Link } clickable/>
        { legend[0].published_at && <Chip label={ timestampToDateStr(legend[0].published_at) } variant='outlined' className={ classes.chip }/> }
      </ArticleContent>
      <ArticleMedia src={ legend[0].image && legend[0].image.src } />
      <ArticleContent><Markdown content={ legend[0].content } /></ArticleContent>
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
