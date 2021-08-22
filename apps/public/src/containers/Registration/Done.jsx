import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { Container, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Alert } from '@material-ui/lab';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles({
  banner: {
    paddingTop: '10vh',
    minHeight: '25vh',
    color: '#fff',
    marginBottom: 20
  },
  h1: {
    fontWeight: 600
  }
});

const List = ({ event, location: { state }}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Helmet title='Registrace odeslána' />
      <Container>
        <Grid container direction="column" justifyContent="center" spacing={ 2 } alignItems="center" className={ classes.banner }>
          <Grid item>
            <Typography gutterBottom variant='h1' className={ classes.h1 }>Přihláška byla odeslána</Typography>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth='md'>
        <Grid container direction='column' spacing={ 2 }>
          <Grid item>

            <Alert severity='success'>Registrace byla úspěšně odeslána.</Alert>
          </Grid>
          <Grid item>
            <Alert severity='info'>Registrace je ve zpracování.</Alert>
          </Grid>
          { state && state.isUnderage && (
            <Grid item>
              <Alert severity='warning'>
              Ještě ti nebylo 18 let a my nechceme být zodpovědní za žádná tvá zranění.
              Nezapomeň si stáhnout, vyplnit a hlavně přinést podepsané potvrzení pro nezletilé.
              </Alert>
            </Grid>
          )}
        </Grid>
        <Grid container justifyContent="center" spacing={ 2 } style={ { marginTop: 20 } }>
          <Grid item>
            <Button color='secondary' variant='contained' size='large' href='./list'>Zobrazit přihlášené účastníky</Button>
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
      </Container>
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
