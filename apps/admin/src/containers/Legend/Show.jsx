import React from "react";
import {
  Show as ShowBase,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  ImageField,
} from "react-admin";

import MarkdownField from "../../components/MarkdownField";

import { LegendTitle } from "./shared";
import { inlineBlock } from "../shared";

const Show = (props) => (
  <ShowBase title={<LegendTitle />} {...props}>
    <SimpleShowLayout>
      <TextField label="ID" source="id" sx={inlineBlock} />
      <TextField label="Název" source="title" sx={inlineBlock} />
      <ReferenceField
        label="Událost"
        source="event"
        reference="events"
        sx={inlineBlock}
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField label="Perex" source="perex" defaultValue="" fullWidth />
      <MarkdownField label="Obsah" source="content" />
      <ImageField source="image.src" label="Obrázek" />
    </SimpleShowLayout>
  </ShowBase>
);

export default Show;
