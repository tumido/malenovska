import { takeEvery } from 'redux-saga/effects';
import firebase from 'firebase/app';

export function* deleteParticipantSubCollection() {
  yield takeEvery('RA/CRUD_DELETE', ({ meta, payload }) => {
    const firestore = firebase.app().firestore();

    if (meta.resource === 'participants') {
      firestore
      .doc(`participants/${payload.id}`)
      .collection('private')
      .get()
      .then(p => p.forEach(d => d.ref.delete()));
    }
  });
}
