import React from 'react';
import { connect } from 'react-redux';
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

  return (
    <React.Fragment>
      <Container className={ classes.root }>
        <Paper className={ classes.content }>
          <Container maxWidth='md'>
            <Typography gutterBottom variant='h4' component='h2' id='top'>Pravidla: { event.name } { event.year }</Typography>
            <Grid container spacing={ 4 }>
              <Grid item>
                <Markdown content={ event.rules } />
              </Grid>
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
