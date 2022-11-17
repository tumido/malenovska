import React from "react";
import {
  Edit as EditBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  NumberInput,
  ImageField,
  required,
} from "react-admin";

import MarkdownInput from "../../components/MarkdownInput";
import { RaceTitle } from "./shared";
import { inlineBlock } from "../shared";
import Grid from "@mui/material/Grid";

const Edit = (props) => (
  <EditBase undoable={false} title={<RaceTitle />} {...props}>
    <SimpleForm>
      <Grid container>
        <TextInput
          label="Název"
          source="name"
          validate={required()}
          sx={inlineBlock}
        />
        <ReferenceInput
          label="Událost"
          source="event"
          reference="events"
          sx={inlineBlock}
        >
          <SelectInput optionText="name" sx={inlineBlock} />
        </ReferenceInput>
        <NumberInput
          label="Limit"
          source="limit"
          validate={required()}
          sx={inlineBlock}
        />
        <NumberInput
          label="Pořadí v registraci"
          source="priority"
          sx={inlineBlock}
        />
      </Grid>
      <Grid container>
        <TextInput
          label="Barva"
          source="color"
          picker="Sketch"
          validate={required()}
          sx={inlineBlock}
        />
        <TextInput
          label="Název barvy"
          source="colorName"
          validate={required()}
          sx={inlineBlock}
        />
      </Grid>
      <MarkdownInput
        label="Legenda"
        source="legend"
        validate={required()}
        fullWidth
      />
      <MarkdownInput
        label="Požadavky"
        source="requirements"
        validate={required()}
        fullWidth
      />
      <ImageInput label="Obrázek" source="image">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </EditBase>
);

export default Edit;
