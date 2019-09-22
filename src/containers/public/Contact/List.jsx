import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Container, Paper, Grid, Avatar, Fab, Icon, Typography, Chip, Card, CardMedia, CardContent, CardHeader, Table, TableBody, TableRow, TableCell, Button } from '@material-ui/core';
import { blue, green, brown, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20
  },
  content: {
    [theme.breakpoints.up('lg')]: {
      paddingTop: 40
    }
  },
  media: {
    height: 200
  },
  blue: {
    backgroundColor: blue.A400,
    '&:hover': {
      backgroundColor: blue.A700
    }
  },
  green: {
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900]
    }
  },
  brown: {
    backgroundColor: brown[700],
    '&:hover': {
      backgroundColor: brown[900]
    }
  },
  red: {
    backgroundColor: red.A400,
    '&:hover': {
      backgroundColor: red.A700
    }
  },
  fab: {
    color: '#fff',
    margin: '20px 40px'
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
    minWidth: 200
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
    <Container className={ classes.root }>
      <Paper className={ classes.content }>
        <Container maxWidth='md'>
          <Typography gutterBottom variant='h4' component='h2' id='top'>Kontakty</Typography>
        </Container>
        { event.contactImage ? (
          <img className={ classes.image } src={ event.contactImage.src } />
        ) : (
          <Skeleton className={ classes.image } variant="rect" height={ 400 } />
        ) }
        <Container maxWidth='md'>
          <Markdown content={ event.contactText } />
        </Container>
        <Grid container justify='center'>
          <div className={ classes.contactItem }>
            <Fab
              className={ clsx(`${classes.blue} ${classes.fab}`) }
              href={ event.contact && event.contact.facebook }
            >
              <Icon className='fab fa-facebook-f'/>
            </Fab>
            <Typography variant='button' display='block'>
              Událost na facebooku
            </Typography>
          </div>
          <div className={ classes.contactItem }>
            <Fab
              className={ clsx(`${classes.green} ${classes.fab}`) }
              href={ event.contact && event.contact.larpovadatabaze }
            >
              <Icon>today</Icon>
            </Fab>
            <Typography variant='button' display='block'>
              Larpová Databáze
            </Typography>
          </div>
          <div className={ classes.contactItem }>
            <Fab
              className={ clsx(`${classes.brown} ${classes.fab}`) }
              href={ event.contact && event.contact.larpcz }
            >
              <Icon>event</Icon>
            </Fab>
            <Typography variant='button' display='block'>
              LARP.cz
            </Typography>
          </div>
          <div className={ classes.contactItem }>
            <Fab
              className={ clsx(`${classes.red} ${classes.fab}`) }
              href={ event.contact && event.contact.email }
            >
              <Icon>mail</Icon>
            </Fab>
            <Typography variant='button' display='block'>
              E-mail
            </Typography>
          </div>
        </Grid>
      </Paper>
    </Container>
  );
};

export default connect(({ event }) => ({ event }))(List);

