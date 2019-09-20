import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Container, Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, Markdown } from 'components';

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
  },
  loading: {
    width: '100%'
  }
}));

const List = ({ rules, event }) => {
  const classes = useStyles();

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
      <Container fixed maxWidth="lg" className={ classes.root }>
        <Paper>
          <div className={ classes.content }>
            <Typography gutterBottom variant='h4' component='h1' id='top'>Pravidla: { event.name } { event.year }</Typography>
            <Grid container spacing={ 4 }>
              { rulesList }
            </Grid>
          </div>
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

export default compose(
  firestoreConnect([
    {
      collection: 'rules',
      orderBy: 'priority'
    }
  ]),
  connect(({ firestore }, { event }) => ({
    rules: firestore.ordered.rules && firestore.ordered.rules.filter(r => r.event && r.event.includes(event.id))
  }))
)(List);
