import React from "react";
import {
  Show as ShowBase,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  UrlField,
  ImageField,
} from "react-admin";

import { GalleryTitle } from "./shared";
import { inlineBlock } from "../shared";

const Show = (props) => (
  <ShowBase title={<GalleryTitle />} {...props}>
    <SimpleShowLayout>
      <ReferenceField
        label="Událost"
        source="event"
        reference="events"
        sx={inlineBlock}
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField label="Autor" source="author" sx={inlineBlock} />
      <br />
      <UrlField label="Odkaz" source="url" fullWidth />
      <ImageField label="Úvodní fotka" source="image.src" />
    </SimpleShowLayout>
  </ShowBase>
);

export default Show;
