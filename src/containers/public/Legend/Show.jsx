import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Typography, Paper, Container, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Loading, ScrollTop, Markdown } from 'components';
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

  useFirestoreConnect(() => ([
    {
      collection: 'legends',
      doc: id,
      storeAs: 'legend'
    }
  ]));
  const legend = useSelector(({ firestore }) => firestore.ordered.legend && firestore.ordered.legend[0]);

  if (!isLoaded(legend)) {
    return <Loading />;
  }

  if (legend.event !== event.id) {
    return 'Tato legenda tu neni'; // FIX-ME po prepsani NotFoundPage

  }

  return (
    <React.Fragment>
      <Container fixed maxWidth="lg" className={ classes.root }>
        <Paper>
          <div className={ classes.content }>
            <Typography gutterBottom variant='h4' component='h1' id='top'>{ legend.title }</Typography>
            <Chip label={ event.name } variant='outlined' className={ classes.chip } to={ `/${event.id}` } component={ Link } clickable/>
            { legend.date && <Chip label={ timestampToDateStr(legend.date) } variant='outlined' className={ classes.chip }/> }
            <Markdown content={ legend.content } />
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
