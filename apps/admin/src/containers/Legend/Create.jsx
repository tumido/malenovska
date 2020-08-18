import React from 'react';
import {
  Create as CreateBase,
  SimpleForm, FormDataConsumer,
  TextInput, DateInput, ReferenceInput, SelectInput, ImageInput,
  ImageField,
  maxLength, required
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';
import SaveWithTransformToolbar from 'components/SaveWithTransformToolbar';

import { useStyles } from '../shared';

const Create = (props) => {
  const classes = useStyles();
  const transform = ({ title }) => title && title.replace(/ /g, '_').toLowerCase().replace(/\W/g, '');

  return (
    <CreateBase title="Nová legenda" { ...props }>
      <SimpleForm toolbar={ <SaveWithTransformToolbar transform={ data => ({ ...data, id: transform({ title: data.title }) }) } /> }>
        <FormDataConsumer formClassName={ classes.inlineBlock }>
          {({ formData: { title }, ...rest }) =>
            <TextInput
              label="ID"
              source="id"
              value={ transform({ title }) || '' }
              { ...rest }
              disabled
            />
          }
        </FormDataConsumer>
        <TextInput label='Název' source="title" defaultValue='' validate={ required() } formClassName={ classes.inlineBlock } />
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } formClassName={ classes.inlineBlock } />
        <TextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth />
        <MarkdownInput label='Obsah' source="content" validate={ required() } />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </CreateBase>
  );
};

export default Create;
