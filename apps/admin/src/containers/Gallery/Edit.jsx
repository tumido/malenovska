import React from "react";
import {
  Edit as EditBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  required,
} from "react-admin";

import { GalleryTitle } from "./shared";
import { inlineBlock } from "../shared";

const Edit = (props) => (
  <EditBase undoable={false} title={<GalleryTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput
        label="Událost"
        source="event"
        reference="events"
        validate={required()}
        sx={inlineBlock}
      >
        <SelectInput optionText="name" />
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
      <ImageInput label="Úvodní fotka" source="cover">
        <ImageField source="src" />
      </ImageInput>
      <TextInput label="Úvodní fotka jako odkaz" source="cover.src" />
    </SimpleForm>
  </EditBase>
);

export default Edit;
