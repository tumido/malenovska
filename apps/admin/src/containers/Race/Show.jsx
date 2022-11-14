import React from "react";
import {
  Show as ShowBase,
  SimpleForm,
  TextField,
  ReferenceField,
  NumberField,
  ImageField,
  required,
} from "react-admin";

import MarkdownField from "../../components/MarkdownField";
import { RaceTitle } from "./shared";
import { inlineBlock } from "../shared";

const Show = (props) => (
  <ShowBase title={<RaceTitle />} {...props}>
    <SimpleForm>
      <TextField
        label="Název"
        source="name"
        validate={required()}
        sx={inlineBlock}
      />
      <ReferenceField
        label="Událost"
        source="event"
        reference="events"
        sx={inlineBlock}
      >
        <TextField source="name" sx={inlineBlock} />
      </ReferenceField>
      <NumberField
        label="Limit"
        source="limit"
        validate={required()}
        sx={inlineBlock}
      />
      <TextField
        label="Barva"
        source="color"
        picker="Sketch"
        validate={required()}
        sx={inlineBlock}
      />
      <TextField
        label="Název barvy"
        source="colorName"
        validate={required()}
        sx={inlineBlock}
      />
      <MarkdownField label="Legenda" source="legend" validate={required()} />
      <MarkdownField
        label="Požadavky"
        source="requirements"
        validate={required()}
      />
      <ImageField source="image.src" title="image.title" />
    </SimpleForm>
  </ShowBase>
);

export default Show;
