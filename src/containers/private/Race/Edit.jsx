import React from 'react';
import {
  Edit as EditBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, ImageInput, NumberInput,
  ImageField,
  required
} from 'react-admin';
import { ColorInput } from 'react-admin-color-input';

import MarkdownInput from 'components/MarkdownInput';
import { RaceTitle } from './shared';

const Edit = (props) => (
  <EditBase title={ <RaceTitle /> } { ...props }>
    <SimpleForm>
      <TextInput label='Název' source="name" validate={ required() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput label='Limit' source='limit' validate={ required() }/>
      <ColorInput label='Barva' source="color" picker='Sketch' validate={ required() } />
      <MarkdownInput label='Legenda' source="legend" validate={ required() } />
      <MarkdownInput label='Požadavky' source="requirements" validate={ required() } />
      <ImageInput label="Obrázek" source="image">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </EditBase>
);

export default Edit;
