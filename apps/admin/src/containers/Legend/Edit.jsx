import React from 'react';
import {
  Edit as EditBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, ImageInput,
  ImageField,
  maxLength, required
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';
import { LegendTitle } from './shared';
import { useStyles } from '../shared';

const Edit = (props) => {
  const classes = useStyles();

  return (
    <EditBase title={<LegendTitle />} {...props}>
      <SimpleForm>
        <TextInput label="ID" source="id" disabled formClassName={classes.inlineBlock} />
        <TextInput label='Název' source="title" validate={required()} formClassName={classes.inlineBlock} />
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={classes.inlineBlock}>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput label='Perex' source="perex" defaultValue='' validate={[required(), maxLength(200)]} fullWidth />
        <MarkdownInput label='Obsah' source="content" validate={required()} />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </EditBase>
  )
};

export default Edit;
