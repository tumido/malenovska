import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Typography, makeStyles, Paper, Container, Chip } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

import { Loading, ScrollTop } from 'components';
import { timestampToDateStr } from '../../utilities/firebase';

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

const LegendDetailPage = ({ legend, event }) => {
  const classes = useStyles();

  if (!isLoaded(legend)) {
    return <Loading />;
  }

  if (legend.event !== event.id) {
    return 'Tato legenda tu neni'; // FIX-ME po prepsani NotFoundPage

  }

  // FIX-ME: remove this preprocessing once admin is available
  const content = legend.content.replace(/\\n/g,'\n');

  return (
    <React.Fragment>
      <Container fixed maxWidth="lg" className={ classes.root }>
        <Paper>
          <div className={ classes.content }>
            <Typography gutterBottom variant='h4' component='h1' id='top'>{ legend.title }</Typography>
            <Chip label={ event.name } variant='outlined' className={ classes.chip } to={ `/${event.id}` } component={ Link } clickable/>
            { legend.date && <Chip label={ timestampToDateStr(legend.date) } variant='outlined' className={ classes.chip }/> }
            <ReactMarkdown source={ content }></ReactMarkdown>
          </div>
        </Paper>
      </Container>
      <ScrollTop anchor='#top' />
    </React.Fragment>
  );
};

LegendDetailPage.propTypes = {
  legend: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    event: PropTypes.string
  }),
  event: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(({ match: { params: { id } } }) => [
    {
      collection: 'legends',
      doc: id,
      storeAs: 'legend'
    }
  ]),
  connect(({ firestore }, { match: { params: { id } } }) => ({
    legend: firestore.ordered.legend && firestore.ordered.legend[0]
  }))
)(LegendDetailPage);
