import React from "react";
import PropTypes from "prop-types";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const ParticipantTitle = ({ record }) => (
  <span>
    Účastník:{" "}
    {record
      ? `${record.firstName} "${record.nickName}" ${record.lastName} (${record.event})`
      : ""}
  </span>
);

ParticipantTitle.propTypes = {
  record: PropTypes.object,
};

export const getPrivateSubDocument = async (participant) => {
  const snapshot = await getDoc(
    doc(getFirestore(), "participants", payload.id, "private", "_")
  )

  return snapshot.data()
};
