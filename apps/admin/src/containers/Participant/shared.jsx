import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';

export const ParticipantTitle = ({ record }) => (
  <span>Účastník: {record ? `${record.firstName} "${record.nickName}" ${record.lastName} (${record.event})` : ''}</span>
);

ParticipantTitle.propTypes = {
  record: PropTypes.object
};

export const getPrivateSubDocument = async (participant) => {
  const firestore = firebase.app().firestore();

  return await firestore
  .doc(`participants/${participant.id}`)
  .collection('private')
  .get()
  .then(p => p.docs[0].data());
};
