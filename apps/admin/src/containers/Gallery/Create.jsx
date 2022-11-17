import React from "react";
import {
  Create as CreateBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  required,
} from "react-admin";

import { inlineBlock } from "../shared";

const Create = (props) => (
  <CreateBase title="Nová galerie" {...props}>
    <SimpleForm>
      <ReferenceInput
        label="Událost"
        source="event"
        reference="events"
        validate={required()}
        sx={inlineBlock}
      >
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <TextInput
        label="Název"
        source="name"
        validate={required()}
        sx={inlineBlock}
      />
      <TextInput
        label="Autor"
        source="author"
        validate={required()}
        sx={inlineBlock}
      />
      <TextInput label="Odkaz" source="url" validate={required()} fullWidth />
      <ImageInput label="Úvodní fotka" validate={required()} source="cover">
        <ImageField source="src" />
      </ImageInput>
      <TextInput label="Úvodní fotka jako odkaz" source="cover.src" />
    </SimpleForm>
  </CreateBase>
);

export default Create;
