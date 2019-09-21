import React from 'react';
import {
  Create, Edit, List, Show,
  SimpleForm, TextInput, DateInput, // Create
  DisabledInput, // Edit
  Datagrid, DateField, TextField, EditButton, DeleteButton // List
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const LegendTitle = ({ record }) => {
  return <span>Legenda: {record ? `"${record.title}"` : ''}</span>;
};

const required = value => value ? undefined : 'Required';

const LegendCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <TextInput source="title" validate={ required }/>
      <MarkdownInput source="content" />
      <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } />
    </SimpleForm>
  </Create>
);

const LegendEdit = (props) => (
  <Edit title={ <LegendTitle /> } { ...props }>
    <SimpleForm>
      <DisabledInput label="Id" source="id" />
      <TextInput source="title" validate={ required } />
      <MarkdownInput source="content" validate={ required } />
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
