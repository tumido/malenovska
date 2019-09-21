import React from 'react';
import {
  Create, Edit, List, Show,
  SimpleForm, TextInput, FormDataConsumer, DateInput, ReferenceInput, SelectInput, DisabledInput, // Create, Edit
  Datagrid, DateField, TextField, EditButton, DeleteButton // List
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const LegendTitle = ({ record }) => (
  <span>Legenda: { record ? `"${record.title}"` : '' }</span>
);

const required = value => value ? undefined : 'Required';

const LegendCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <FormDataConsumer>
        {({ formData: { title }, ...rest }) =>
          <DisabledInput label="ID" source="id" defaultValue={ title && title.replace(/ /, '_').toLowerCase() }  { ...rest } />
        }
      </FormDataConsumer>
      <TextInput label='Název' source="title" defaultValue='' validate={ required } />
      <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <MarkdownInput label='Obsah' source="content" validate={ required } />
    </SimpleForm>
  </Create>
);

const LegendEdit = (props) => (
  <Edit title={ <LegendTitle /> } { ...props }>
    <SimpleForm>
      <DisabledInput label="ID" source="id" />
      <TextInput label='Název' source="title" validate={ required } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <MarkdownInput label='Obsah' source="content" validate={ required } />
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
