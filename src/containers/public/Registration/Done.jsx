import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { Container, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  paper: {
    padding: '40px 16px'
  },
  h1: {
    fontWeight: 600
  },
  banner: {
    paddingTop: '10vh',
    minHeight: '25vh',
    color: '#fff',
    marginBottom: 20
  }
}));

const List = ({ event, location: { state }}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container>
        <Grid container direction="column" justify="center" spacing={ 2 } alignItems="center" className={ classes.banner }>
          <Grid item>
            <Typography gutterBottom variant='h1' className={ classes.h1 }>Přihláška byla odeslána</Typography>
          </Grid>
        </Grid>
      </Container>
      <Article>
        <React.Fragment>
          <Typography gutterBottom variant='subtitle1'>
            Registraci zpracujeme. Tvé jméno se co nevidět objeví v seznamu účastníků.
          </Typography>
          { state && state.isUnderage &&
            <Typography paragraph color='secondary' variant='body1'>
              Ještě ti nebylo 18 let a my nechceme být zodpovědní za žádná tvá zranění.
              Nezapomeň si stáhnout, vyplnit a hlavně přinést podepsané potvrzení pro nezletilé.
            </Typography>
          }
        </React.Fragment>
        <Grid container justify="center" spacing={ 2 }>
          <Grid item>
            <Button color='primary' variant='contained' size='large' href='./list'>Zobrazit přihlášené účastníky</Button>
          </Grid>
          <Grid item>
            <Button
              color='secondary'
              variant='contained'
              size='large'
              target='_blank'
              href={ event.declaration && event.declaration.src }
            >
              Potvrzení pro nezletilé
            </Button>
          </Grid>
        </Grid>
      </Article>
    </React.Fragment>
  );
};

List.propTypes = {
  event: PropTypes.shape({
    declaration: PropTypes.shape({
      src: PropTypes.string.isRequired
    })
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      isUnderage: PropTypes.bool
    })
  }).isRequired
};

export default compose(
  withRouter,
  connect(({ event }) => ({ event }))
)(List);
