import React from 'react';
import {
  Edit as EditBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, DisabledInput, LongTextInput, ImageInput,
  ImageField,
  maxLength, required // Validators
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';
import { LegendTitle } from './shared';

const Edit = (props) => (
  <EditBase title={ <LegendTitle /> } { ...props }>
    <SimpleForm>
      <DisabledInput label="ID" source="id" />
      <TextInput label='Název' source="title" validate={ required() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <LongTextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth/>
      <MarkdownInput label='Obsah' source="content" validate={ required() } />
      <ImageInput source="image" label="Obrázek">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </EditBase>
);

export default Edit;
