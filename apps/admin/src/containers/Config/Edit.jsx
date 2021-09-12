import React from "react";
import {
  Edit as EditBase,
  SimpleForm,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { useStyles } from "../shared";

const Edit = (props) => {
  const classes = useStyles();

  return (
    <EditBase title="Nastavení" {...props}>
      <SimpleForm redirect="/">
        <ReferenceInput
          label="Událost"
          source="event"
          reference="events"
          formClassName={classes.inlineBlock}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </EditBase>
  );
};

export default Edit;
