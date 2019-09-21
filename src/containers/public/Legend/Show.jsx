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
    padding: '20px 10px',
    [theme.breakpoints.up('md')]: {
      padding: '60px 10px'
    },
    margin: 'auto',
    maxWidth: 750
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const Show = ({ match: { params: { id }}, event }) => {
  const classes = useStyles();

  console.log(useSelector(({ firebase }) => firebase));

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
          <Paper>
            <div className={ classes.content }>
              <Skeleton type='rect' height={ 100 } />
              <Skeleton type='text' height={ 24 } />
              <Skeleton type='text' />
              <Skeleton type='text' />
              <Skeleton type='text' />
            </div>
          </Paper>
        </Container>
      </React.Fragment>
    );
  };

  if (!legend.length || legend[0].event !== event.id) {
    return <Redirect to='/not-found' />;
  }

  return (
    <React.Fragment>
      <Container fixed maxWidth="lg" className={ classes.root }>
        <Paper>
          <div className={ classes.content }>
            <Typography gutterBottom variant='h4' component='h1' id='top'>{ legend[0].title }</Typography>
            <Chip label={ event.name } variant='outlined' className={ classes.chip } to={ `/${event.id}` } component={ Link } clickable/>
            { legend[0].date && <Chip label={ timestampToDateStr(legend[0].date) } variant='outlined' className={ classes.chip }/> }
            <Markdown content={ legend[0].content } />
          </div>
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
