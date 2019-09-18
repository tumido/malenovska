import React from 'react';
import { connect, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Wizard } from 'components';
import { RaceSelect, Readout } from './steps';
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
  stepper: {
    background: 'transparent'
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

  const [ stepperEl, setStepperEl ] = React.useState(null);
  const handleStepperRef = React.useCallback(instance => setStepperEl(instance), [ setStepperEl ]);

  const handleSubmit = console.log;

  if (!isLoaded(races)) {
    return 'Loading';
  }

  return (
    <Container fixed>
      <div ref={ handleStepperRef } />
      <Paper>
        <Wizard
          onSubmit={ handleSubmit }
          formName='registration'
          stepperProps={ {
            ref: stepperEl,
            className: classes.stepper
          } }
          validate={ validate }
        >
          <RaceSelect races={ races }/>
          <Readout races={ races }/>
        </Wizard>
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
