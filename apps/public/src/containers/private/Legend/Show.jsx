import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, ImageField
} from 'react-admin';

import MarkdownField from 'components/MarkdownField';

import { LegendTitle } from './shared';

const Show = (props) => (
  <ShowBase title={ <LegendTitle /> } { ...props }>
    <SimpleForm>
      <TextField label="ID" source="id" />
      <TextField label='Název' source="title" />
      <ReferenceField label="Událost" source="event" reference="events">
        <TextField source="name" />
      </ReferenceField>
      <TextField label='Perex' source="perex" defaultValue='' fullWidth/>
      <MarkdownField label='Obsah' source="content" />
      <ImageField source="image.src" label="Obrázek" />
    </SimpleForm>
  </ShowBase>
);

export default Show;
