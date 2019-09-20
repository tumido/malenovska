import { PARTICIPANT } from '../actionTypes';

export const registerNewParticipant = ({
  event, age, email, firstName, group = '', lastName, nickName = '',  race
}) => (dispatch, getState, getFirebase) => {
  dispatch({ type: PARTICIPANT.add.pending });

  const personDataPublic = { firstName, nickName, lastName, race, group };
  const personDataPrivate = { age, email };

  const firestore = getFirebase().firestore();
  const batch = firestore.batch();

  const personDoc = firestore.collection('events').doc(event).collection('participants').doc(`${firstName} "${nickName}" ${lastName}`);

  batch.set(personDoc, personDataPublic);
  batch.set(personDoc.collection('private').doc(), personDataPrivate);

  return batch.commit()
  .then(
    () => {
      dispatch({ type: PARTICIPANT.add.success });
      alert(`${race} tě přijímají do svých řad.\n\nSpolehlivě upsáno! 🍺`);
    },
    ({ code }) => {
      dispatch({ type: PARTICIPANT.add.failed });
      code === 'permission-denied'
        ? alert('Tento účastík je již nejspíše registrován. Pokud jste však přesvědčeni o své pravdě, křičte!')
        : alert('Něco se nepovedlo. Dejte nám vědět, prosím...');
    }
  );
};
