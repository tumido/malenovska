import React from "react";
import PropTypes from "prop-types";
import {
  Edit as EditBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  maxLength,
  DateInput,
  required,
} from "react-admin";

import MarkdownInput from "../../components/MarkdownInput";
import { LegendTitle } from "./shared";
import { inlineBlock } from "../shared";
import Grid from "@mui/material/Grid";

const Edit = (props) => (
  <EditBase
    undoable={false}
    title={<LegendTitle />}
    {...props}
  >
    <SimpleForm>
      <Grid container>
        <TextInput label="ID" source="id" disabled sx={inlineBlock} />
        <TextInput
          label="Název"
          source="title"
          validate={required()}
          sx={inlineBlock}
        />
        <ReferenceInput label="Událost" source="event" reference="events">
          <SelectInput optionText="name" sx={inlineBlock} />
        </ReferenceInput>
        <DateInput
          label="Datum publikace"
          source="publishedAt"
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
  </EditBase>
);

export default Edit;
