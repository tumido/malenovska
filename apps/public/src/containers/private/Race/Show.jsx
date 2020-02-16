import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, NumberField, ImageField,
  required
} from 'react-admin';
import { ColorField } from 'react-admin-color-input';

import MarkdownField from 'components/MarkdownField';
import { RaceTitle } from './shared';

const Show = (props) => (
  <ShowBase title={ <RaceTitle /> } { ...props }>
    <SimpleForm>
      <TextField label='Název' source="name" validate={ required() } />
      <ReferenceField label="Událost" source="event" reference="events">
        <TextField optionText="name" />
      </ReferenceField>
      <NumberField label='Limit' source='limit' validate={ required() }/>
      <ColorField label='Barva' source="color" picker='Sketch' validate={ required() } />
      <MarkdownField label='Legenda' source="legend" validate={ required() } />
      <MarkdownField label='Požadavky' source="requirements" validate={ required() } />
      <ImageField source="src" title="title" />
    </SimpleForm>
  </ShowBase>
);

export default Show;
