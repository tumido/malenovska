import React from "react";
import {
  Create as CreateBase,
  SimpleForm,
  FormDataConsumer,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  DateInput,
  maxLength,
  required,
} from "react-admin";

import MarkdownInput from "../../components/MarkdownInput";
import SaveWithTransformToolbar from "../../components/SaveWithTransformToolbar";
import Grid from "@mui/material/Grid";

import { inlineBlock } from "../shared";

const transform = (title) =>
  title && title.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");

const Create = (props) => (
  <CreateBase title="Nová legenda" {...props} >
    <SimpleForm
      toolbar={
        <SaveWithTransformToolbar
          transform={(data) => ({
              ...data,
              id: transform(data.title),
            })}
        />
      }
    >
      <Grid container>
        <TextInput
          label="Název"
          source="title"
          defaultValue=""
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
        <DateInput
          label="Datum publikace"
          source="publishedAt"
          defaultValue={new Date()}
          sx={inlineBlock}
        />
      </Grid>
      <TextInput
        label="Perex"
        source="perex"
        defaultValue=""
        validate={[required(), maxLength(200)]}
        fullWidth
      />
      <MarkdownInput
        label="Obsah"
        source="content"
        validate={required()}
        fullWidth
      />
      <ImageInput source="image" label="Obrázek">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </CreateBase>
);

export default Create;
