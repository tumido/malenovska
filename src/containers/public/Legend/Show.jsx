import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Typography, Paper, Container, Chip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { ScrollTop, Markdown } from 'components';
import { timestampToDateStr } from 'utilities/firebase';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '20px'
  },
  content: {
    paddingTop: 20,
    paddingBottom: 20,
    [theme.breakpoints.up('md')]: {
      paddingTop: 60,
      paddingBottom: 60
    }
  },
  chip: {
    margin: theme.spacing(1)
  },
  image: {
    height: 400,
    width: '100%',
    objectFit: 'cover',
    marginTop: '2em',
    marginBottom: '2em'
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
    return (
      <React.Fragment>
        <Container fixed maxWidth="lg" className={ classes.root }>
          <Paper className={ classes.content }>
            <Container maxWidth='md'>
              <Typography gutterBottom variant='h4' component='h1' id='top'>
                <Skeleton type='text' width={ 400 } />
              </Typography>
            </Container>
            <Skeleton className={ classes.image } type='rect' height={ 400 } />
            <Container maxWidth='md'>
              <Skeleton type='text' height={ 24 } />
              <Skeleton type='text' />
              <Skeleton type='text' />
              <Skeleton type='text' />
            </Container>
          </Paper>
        </Container>
      </React.Fragment>
    );
  }; // eslint-disable-line padding-line-between-statements

  if (!legend.length || legend[0].event !== event.id) {
    return <Redirect to='/not-found' />;
  }

  return (
    <React.Fragment>
      <Container fixed maxWidth="lg" className={ classes.root }>
        <Paper className={ classes.content }>
          <Container maxWidth='md'>
            <Typography gutterBottom variant='h4' component='h1' id='top'>{ legend[0].title }</Typography>
            <Chip label={ event.name } variant='outlined' className={ classes.chip } to={ `/${event.id}` } component={ Link } clickable/>
            { legend[0].published_at && <Chip label={ timestampToDateStr(legend[0].published_at) } variant='outlined' className={ classes.chip }/> }
          </Container>
          { legend[0].image ? (
            <img className={ classes.image } src={ legend[0].image.src } />
          ) : (
            <Skeleton variant="rect" height={ 400 } />
          ) }
          <Container maxWidth='md'>
            <Markdown content={ legend[0].content } />
          </Container>
        </Paper>
      </Container>
      <ScrollTop anchor='#top' />
    </React.Fragment>
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
