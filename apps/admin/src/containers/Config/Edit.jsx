import React from "react";
import {
  Edit as EditBase,
  SimpleForm,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const Edit = (props) => (
    <EditBase title="Nastavení" {...props}>
      <SimpleForm redirect="/">
        <ReferenceInput
          label="Událost"
          source="event"
          reference="events"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </EditBase>
  );

export default Edit;
