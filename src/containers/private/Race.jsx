import React from 'react';
import PropTypes from 'prop-types';
import {
  Create, Edit, List,
  SimpleForm, TextInput, ReferenceInput, SelectInput, FileInput, FileField, NumberInput, // Create, Edit
  Datagrid, DateField, TextField, EditButton, DeleteButton // List
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const RaceTitle = ({ record }) => (
  <span>Racea: { record ? `"${record.name}"` : '' }</span>
);

RaceTitle.propTypes = {
  record: PropTypes.object.isRequired
};

const required = value => value ? undefined : 'Required';

const RaceCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <TextInput label='Název' source="name" validate={ required } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput label='Limit' source='limit' validate={ required }/>
      <MarkdownInput label='Legenda' source="legend" validate={ required } />
      <MarkdownInput label='Požadavky' source="requirements" validate={ required } />
      <FileInput source="image" label="Obrázek">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

const RaceEdit = (props) => (
  <Edit title={ <RaceTitle /> } { ...props }>
    <SimpleForm>
      <TextInput label='Název' source="name" validate={ required } />
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput label='Limit' source='limit' validate={ required }/>
      <MarkdownInput label='Legenda' source="legend" validate={ required } />
      <MarkdownInput label='Požadavky' source="requirements" validate={ required } />
      <FileInput label="Obrázek" source="image">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

const RaceList = (props) => (
  <List { ...props }>
    <Datagrid>
      <TextField label='Jméno' source="name" />
      <TextField label='Událost' source="event" />
      <TextField label='Limit' source="limit" />
      <TextField label="Autor" source="createdby" />
      <DateField label="Vytvořeno" source="createdate" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <DeleteButton />
      <EditButton basePath="/races" />
    </Datagrid>
  </List>
);

// const RaceShow = (props) => (
// );

export default {
  Create: RaceCreate,
  Edit: RaceEdit,
  List: RaceList
  // Show: RaceShow
};
