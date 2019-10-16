import React from 'react';
import {
  Create as CreateBase,
  SimpleForm, FormDataConsumer,
  TextInput, DateInput, ReferenceInput, SelectInput, DisabledInput, LongTextInput, ImageInput,
  ImageField,
  maxLength, required
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const Create = (props) => (
  <CreateBase { ...props }>
    <SimpleForm>
      <FormDataConsumer>
        {({ formData: { title }, ...rest }) =>
          <DisabledInput
            label="ID"
            source="id"
            defaultValue={ title && title.replace(/ /g, '_').toLowerCase().replace(/\W/g, '') }
            { ...rest }
          />
        }
      </FormDataConsumer>
      <TextInput label='Název' source="title" defaultValue='' validate={ required() } />
      <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <LongTextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth/>
      <MarkdownInput label='Obsah' source="content" validate={ required() } />
      <ImageInput source="image" label="Obrázek">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </CreateBase>
);

export default Create;
