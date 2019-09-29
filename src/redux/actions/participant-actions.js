import { PARTICIPANT } from '../actionTypes';
import { openNotification, closeNotification } from './notify-actions';

export const registerNewParticipant = ({
  event, age, email, firstName, group = '', lastName, nickName = '',  race
}) => (dispatch, getState, getFirebase) => {
  dispatch({ type: PARTICIPANT.add.pending });
  dispatch(openNotification({
    message: `Registruji: ${firstName} ${lastName}`,
    id: 'reg_pending',
    options: { action: 'spinner' }
  }));

  const personDataPublic = { firstName, nickName, lastName, race, group, event };
  const personDataPrivate = { age, email };

  const firestore = getFirebase().firestore();
  const batch = firestore.batch();

  const personDoc = firestore.collection('participants').doc(`${event}:${firstName}-${nickName}-${lastName}`);

  batch.set(personDoc, personDataPublic);
  batch.set(personDoc.collection('private').doc(), personDataPrivate);

  return batch.commit()
  .then(
    () => {
      dispatch({ type: PARTICIPANT.add.success });
      dispatch(closeNotification('reg_pending'));
      dispatch(openNotification({
        message: 'Registrace proběhla úspěšně',
        options: {
          action: 'close',
          variant: 'success'
        }
      }));
    },
    ({ code }) => {
      dispatch({ type: PARTICIPANT.add.failed });
      dispatch(closeNotification('reg_pending'));
      dispatch(openNotification({
        message: code === 'permission-denied'
          ? 'Tento účastík je již registrován'
          : 'Něco se nepovedlo, kontaktujte nás prosím',
        options: {
          action: 'close',
          variant: 'error'
        },
        persist: true
      }));
    }
  );
};
