import React from "react";
import {
  Filter,
  ReferenceInput,
  SelectInput,
  DateField,
  useLocale,
} from "react-admin";

import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";

export const EventFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput source="event" reference="events" label="Událost" alwaysOn>
      <SelectInput source="name" optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const LocaleDateField = (props) => {
  const locale = useLocale();

  return <DateField {...props} locales={locale} />;
};

LocaleDateField.defaultProps = {
  addLabel: true,
};

export const useStyles = makeStyles({
  inlineBlock: { display: "inline-flex", marginRight: "1rem" },
});

const metadata = {
  metadata: {
    cacheControl: "public, max-age=31536000",
  },
};

export const setCacheForRecord =
  ({ collection, records, isCreate, notify, redirectTo, basePath }) =>
  ({ data }) => {
    const storageRef = firebase.app().storage().ref();
    records.map((r) => {
      if (!(r in data)) {
        return;
      }

      const key = `${collection}/${data.id}/${r}`;
      console.log("Setting cache for updated image: ", key);

      return storageRef
        .child(key)
        .updateMetadata(metadata)
        .then(() => notify("ra.notification.metadata_updated", "info"))
        .catch(() =>
          notify("ra.notification.metadata_update_error", "error", {
            name: key,
          })
        );
    });

    notify(
      isCreate ? "ra.notification.created" : "ra.notification.updated",
      "info",
      { smart_count: 1 }
    ); //eslint-disable-line
    redirectTo(isCreate ? "edit" : "list", basePath, data.id, data);
  };

export const deletePrivateSubCollection = ({ collection, records }) => {
  const collectionRef = firebase.firestore().collection(collection);
  records.map((r) =>
    collectionRef.doc(r).collection("private").doc("_").delete()
  );
};

export default {
  EventFilter,
  LocaleDateField,
};
