import React from 'react';
import {
  Create as CreateBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, ImageInput, NumberInput,
  ImageField,
  required
} from 'react-admin';
import { ColorInput } from 'react-admin-color-input';

import MarkdownInput from 'components/MarkdownInput';
import { useStyles } from '../shared';

const Create = (props) => {
  const classes = useStyles();

  return (
    <CreateBase title="Nová strana" { ...props }>
      <SimpleForm>
        <TextInput label='Název' source="name" validate={ required() } formClassName={ classes.inlineBlock } />
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput label='Limit' source='limit' validate={ required() } formClassName={ classes.inlineBlock } />
        <ColorInput label='Barva' source="color" picker='Sketch' validate={ required() } />
        <MarkdownInput label='Legenda' source="legend" validate={ required() } />
        <MarkdownInput label='Požadavky' source="requirements" validate={ required() } />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </CreateBase>
  );
};

export default Create;
