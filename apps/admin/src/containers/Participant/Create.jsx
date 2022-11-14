import React from "react";
import {
  Create as CreateBase,
  SimpleForm,
  FormDataConsumer,
  TextInput,
  ReferenceInput,
  SelectInput,
  required,
} from "react-admin";

import { inlineBlock } from "../shared";

const Create = (props) => (
  <CreateBase title="Nový účastník" {...props}>
    <SimpleForm>
      <FormDataConsumer sx={inlineBlock}>
        {({ formData: { firstName, lastName, nickName, event }, ...rest }) => (
          <TextInput
            label="ID"
            source="id"
            value={`${event}:${firstName}-${nickName}-${lastName}`}
            {...rest}
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
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput
        label="Strana"
        source="race"
        reference="races"
        sx={inlineBlock}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
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
  </CreateBase>
);

export default Create;
