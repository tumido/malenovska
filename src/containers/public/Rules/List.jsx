import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
    paddingTop: 20
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      paddingTop: 40
    },
    paddingTop: 16,
    paddingBottom: 16
  },
  chip: {
    margin: theme.spacing(1)
  },
  loading: {
    width: '100%'
  },
  image: {
    height: 400,
    width: '100%',
    objectFit: 'cover',
    marginTop: '2em',
    marginBottom: '2em'
  }
}));

const List = ({ event }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container className={ classes.root }>
        <Paper className={ classes.paper }>
          <Container maxWidth='md'>
            <Typography gutterBottom variant='h4' component='h2' id='top'>Pravidla: { event.name } { event.year }</Typography>
          </Container>
          { event.rules_image ? (
            <img className={ classes.image } src={ event.rules_image.src } />
          ) : (
            <Skeleton variant="rect" height={ 400 } />
          ) }
          <Container maxWidth='md'>
            <Markdown content={ event.rules } />
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
