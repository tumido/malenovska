import React from 'react';
import { connect, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Container, Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20
  },
  content: {
    [theme.breakpoints.up('lg')]: {
      paddingTop: 40
    }
  },
  chip: {
    margin: theme.spacing(1)
  },
  loading: {
    width: '100%'
  }
}));

const List = ({ event }) => {
  const classes = useStyles();

  useFirestoreConnect(() => [
    {
      collection: 'events',
      doc: event.id,
      subcollections: [{ collection: 'rules' }],
      storeAs: 'rules'
    }
  ]);
  const rules = useSelector(({ firestore }) => firestore.ordered.rules);

  const rulesList = !isLoaded(rules)
    ? (
      <React.Fragment>
        <Grid item className={ classes.loading }>
          <Skeleton height='3em' width='50%'/>
          <Skeleton/>
          <Skeleton/>
          <Skeleton width='90%'/>
          <Skeleton width='20%'/>
          <Skeleton/>
          <Skeleton width='90%'/>
        </Grid>
        <Grid item className={ classes.loading }>
          <Skeleton height='3em' width='30%'/>
          <Skeleton width='90%'/>
          <Skeleton/>
          <Skeleton height='2em' width='40%'/>
          <Skeleton/>
          <Skeleton width='90%'/>
          <Skeleton/>
        </Grid>
      </React.Fragment>
    ) : rules.map(rule => (
      <Grid item key={ rule.id }>
        <Markdown content={ rule.content } />
      </Grid>
    ));

  return (
    <React.Fragment>
      <Container className={ classes.root }>
        <Paper className={ classes.content }>
          <Container maxWidth='md'>
            <Typography gutterBottom variant='h4' component='h2' id='top'>Pravidla: { event.name } { event.year }</Typography>
            <Grid container spacing={ 4 }>
              { rulesList }
            </Grid>
          </Container>
        </Paper>
      </Container>
      <ScrollTop anchor='#top' />
    </React.Fragment>
  );
};

List.propTypes = {
  event: PropTypes.object.isRequired,
  rules: PropTypes.array
};

export default connect(({ event }) => ({ event }))(List);
