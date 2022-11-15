import React from "react";
import {
  Edit as EditBase,
  SimpleForm,
  FormDataConsumer,
  TextInput,
  ReferenceInput,
  SelectInput,
  required,
} from "react-admin";

import { ParticipantTitle } from "./shared";
import { inlineBlock } from "../shared";

const Edit = (props) => (
  <EditBase title={<ParticipantTitle />} {...props}>
    <SimpleForm>
      <FormDataConsumer {...props} sx={inlineBlock}>
        {({ formData: { firstName, lastName, nickName, event } }) => (
          <TextInput
            label="ID"
            source="id"
            value={`${event}:${firstName}-${nickName}-${lastName}`}
            disabled
          />
        )}
      </FormDataConsumer>
      <ReferenceInput
        label="Událost"
        source="event"
        reference="events"
        sx={inlineBlock}
      >
        <SelectInput disabled optionText="name" />
      </ReferenceInput>
      <FormDataConsumer {...props} sx={inlineBlock}>
        {({ formData: { event } }) => (
          <ReferenceInput
            label="Strana"
            source="race"
            reference="races"
            filter={{ event }}
            sx={inlineBlock}
          >
            <SelectInput optionText="name" />
          </ReferenceInput>
        )}
      </FormDataConsumer>
      <br />
      <TextInput
        label="Jméno"
        source="firstName"
        validate={required()}
        sx={inlineBlock}
      />
      <TextInput label="Přezdívka" source="nickName" sx={inlineBlock} />
      <TextInput
        label="Příjmení"
        source="lastName"
        validate={required()}
        sx={inlineBlock}
      />
      <br />
      <TextInput label="Skupina" source="group" fullWidth />
    </SimpleForm>
  </EditBase>
);

export default Edit;
