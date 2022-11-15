import { takeEvery } from "redux-saga/effects";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export function* deleteParticipantSubCollection() {
  yield takeEvery("RA/CRUD_DELETE", ({ meta, payload }) => {
    if (meta.resource === "participants") {
      getDocs(
        collection(getFirestore(), "participants", payload.id, "private")
      ).then((p) => p.forEach((d) => d.ref.delete()));
    }
  });
}
