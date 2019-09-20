import React from 'react';
import { connect, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Container, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Wizard } from 'components';
import { RaceSelect, Readout, PersonalDetails } from './steps';
import validate from './validate';

// const addParticipant = (firestore, values, counts, limit) => {
//   let publicData = pick(values, ['nickname', 'firstName', 'lastName', 'group', 'race', 'raceRef']);
//   let privateData = pick(values, ['age', 'email']);

//   if (counts[values.raceRef.id].length >= limit) {
//     alert("Tady uže je plno!");
//     return;
//   }

//   var batch = firestore.batch();
//   let participant = firestore.collection('participants').doc(`${values.firstName}-${values.lastName}-(${values.nickname})`);
//   let participantPrivate = participant.collection('private').doc();
//   batch.set(participant, publicData);
//   batch.set(participantPrivate, privateData);

//   batch.commit().then(result => {
//     alert(`${values.race} tě přijímají do svých řad.\n\nSpolehlivě upsáno! 🍺`)
//   })
//   .catch(err => {(
//     err.code == "permission-denied"
//       ? alert("Tento účastík je již nejspíše registrován. Pokud jste však přesvědčeni o své pravdě, křičte!")
//       : alert("Něco se nepovedlo. Dejte nám vědět, prosím...")
//   )})
// }

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

const RegistrationPage = ({ event }) => {
  const classes = useStyles();

  useFirestoreConnect(() => [
    {
      collection: 'events',
      doc: event,
      subcollections: [{ collection: 'races' }],
      storeAs: 'races'
    },
    {
      collection: 'events',
      doc: event,
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

  const handleSubmit = console.log;

  return (
    <Container className={ classes.root }>
      <Paper className={ classes.paper }>
        <Grid container direction='column' wrap='nowrap' spacing={ 2 } >
          <Grid item ref={ handleStepperRef }/>
          <Grid item>
            <Wizard
              isLoading={ !isLoaded(races) || !isLoaded(participants) }
              onSubmit={ handleSubmit }
              formName='registration'
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

RegistrationPage.propTypes = {
  event: PropTypes.string
};

export default connect(({ event }) => ({
  event: event.eventId
}))(RegistrationPage);
