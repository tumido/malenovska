import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Grid, Fab, Icon, Typography } from '@material-ui/core';
import { blue, green, brown, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import { Article, ArticleContent, ArticleMedia, Markdown } from 'components';

const useStyles = makeStyles(() => ({
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
    margin: '20px 40px',
    textAlign: 'center'
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
    <Article>
      <ArticleContent><Typography gutterBottom variant='h4' component='h2'>Kontakty</Typography></ArticleContent>
      <ArticleMedia src={ event.contactImage && event.contactImage.src } />
      <ArticleContent><Markdown content={ event.contactText } /></ArticleContent>
      <Grid container justify='center'>
        <div className={ classes.contactItem }>
          <Fab
            className={ clsx(`${classes.blue} ${classes.fab}`) }
            href={ event.contact && event.contact.facebook }
            target='_blank'
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
            target='_blank'
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
            target='_blank'
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
            target='_blank'
          >
            <Icon>mail</Icon>
          </Fab>
          <Typography variant='button' display='block'>
            E-mail
          </Typography>
        </div>
      </Grid>
    </Article>
  );
};

List.propTypes = {
  event: PropTypes.shape({
    contactImage: PropTypes.shape({
      src: PropTypes.string.isRequired
    }),
    contactText: PropTypes.string.isRequired,
    contact: PropTypes.shape({
      facebook: PropTypes.string,
      larpovadatabaze: PropTypes.string,
      larpcz: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired
};

export default connect(({ event }) => ({ event }))(List);

