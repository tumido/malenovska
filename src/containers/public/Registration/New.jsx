import React from 'react';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

import { Container, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Wizard } from 'components';
import { RaceSelect, Readout, PersonalDetails } from './steps';
import validate from './validate';
import { registerNewParticipant  } from 'redux/actions/participant-actions';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  paper: {
    [theme.breakpoints.up('lg')]: {
      marginTop: 40
    },
    padding: '0 16px'
  },
  stepper: {
    background: 'transparent'
  },
  buttons: {
    margin: 20,
    '& > *': {
      margin: 20
    }
  },
  buttonWrapper: {
    alignSelf: 'center'
  }
}));

const formName = 'registration';

const New = ({ event, registerNewParticipant, history }) => {
  const classes = useStyles();

  useFirestoreConnect(() => [
    {
      collection: 'events',
      doc: event.id,
      subcollections: [{ collection: 'races' }],
      storeAs: 'races'
    },
    {
      collection: 'events',
      doc: event.id,
      subcollections: [{ collection: 'participants' }],
      storeAs: 'participants'
    }
  ]);
  const races = useSelector(({ firestore }) => firestore.ordered.races);
  const participants = useSelector(({ firestore }) => firestore.ordered.participants);

  const [ stepperEl, setStepperEl ] = React.useState(null);
  const handleStepperRef = React.useCallback(instance => setStepperEl(instance), [ setStepperEl ]);

  const [ buttonsEl, setButtonsEl ] = React.useState(null);
  const handleButtonsRef = React.useCallback(instance => setButtonsEl(instance), [ setButtonsEl ]);

  const handleSubmit = values => {
    registerNewParticipant({ event: event.id, ...values });
    history.push('./list');
  };

  return (
    <Container className={ classes.root }>
      <Paper className={ classes.paper }>
        <Grid container direction='column' wrap='nowrap' spacing={ 2 } >
          <Grid item ref={ handleStepperRef }/>
          <Grid item>
            <Wizard
              isLoading={ !isLoaded(races) || !isLoaded(participants) }
              onSubmit={ handleSubmit }
              formName={ formName }
              stepperProps={ {
                className: classes.stepper,
                names: [
                  'Výběr strany',
                  'Legenda',
                  'Osobní údaje'
                ]
              } }
              buttonsProps={ {
                className: classes.buttons
              } }
              portals={ {
                stepper: stepperEl,
                buttons: buttonsEl
              } }
              validate={ validate }
              classes={ classes }
            >
              <RaceSelect races={ races } participants={ participants }/>
              <Readout races={ races } participants={ participants }/>
              <PersonalDetails races={ races }/>
            </Wizard>
          </Grid>
          <Grid item className={ classes.buttonWrapper } ref={ handleButtonsRef }/>
        </Grid>
      </Paper>
    </Container>
  );
};

New.propTypes = {
  event: PropTypes.object.isRequired,
  registerNewParticipant: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  connect(
    ({ event }) => ({ event }),
    { registerNewParticipant }
  )
)(New);
