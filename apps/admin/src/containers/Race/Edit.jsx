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
import { useStyles } from '../shared';


const Edit = (props) => {
  const classes = useStyles();

  return (
    <EditBase title={<RaceTitle />} {...props}>
      <SimpleForm>
        <TextInput label='Název' source="name" validate={required()} formClassName={classes.inlineBlock} />
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={classes.inlineBlock} >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput label='Limit' source='limit' validate={required()} formClassName={classes.inlineBlock} />
        <ColorInput label='Barva' source="color" picker='Sketch' validate={required()} />
        <MarkdownInput label='Legenda' source="legend" validate={required()} />
        <MarkdownInput label='Požadavky' source="requirements" validate={required()} />
        <ImageInput label="Obrázek" source="image">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </EditBase>
  )
};

export default Edit;
