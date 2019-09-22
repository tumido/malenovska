import React from 'react';
import PropTypes from 'prop-types';
import {
  Create, Edit, List,
  SimpleForm, TextInput, FormDataConsumer, DateInput, ReferenceInput, SelectInput, DisabledInput, LongTextInput,
  FileField, FileInput, // Create, Edit
  Datagrid, DateField, TextField, EditButton, DeleteButton, // List
  maxLength, required // Validators
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const LegendTitle = ({ record }) => (
  <span>Legenda: { record ? `"${record.title}"` : '' }</span>
);

LegendTitle.propTypes = {
  record: PropTypes.object.isRequired
};

const LegendCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <FormDataConsumer>
        {({ formData: { title }, ...rest }) =>
          <DisabledInput label="ID" source="id" defaultValue={ title && title.replace(/ /g, '_').toLowerCase().replace(/\W/g, '') }  { ...rest } />
        }
      </FormDataConsumer>
      <TextInput label='Název' source="title" defaultValue='' validate={ required() } />
      <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <LongTextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth/>
      <MarkdownInput label='Obsah' source="content" validate={ required() } />
      <FileInput source="image" label="Obrázek">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

const LegendEdit = (props) => (
  <Edit title={ <LegendTitle /> } { ...props }>
    <SimpleForm>
      <DisabledInput label="ID" source="id" />
      <TextInput label='Název' source="title" validate={ required() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <LongTextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth/>
      <MarkdownInput label='Obsah' source="content" validate={ required() } />
      <FileInput source="image" label="Obrázek">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

const LegendList = (props) => (
  <List { ...props }>
    <Datagrid>
      <TextField label='Název' source="title" />
      <TextField label='Událost' source="event" />
      <TextField label="Autor" source="createdby" />
      <DateField label="Vytvořeno" source="createdate" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <DeleteButton />
      <EditButton basePath="/legends" />
    </Datagrid>
  </List>
);

// const LegendShow = (props) => (
// );

export default {
  Create: LegendCreate,
  Edit: LegendEdit,
  List: LegendList
  // Show: LegendShow
};
