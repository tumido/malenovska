import React from 'react';
import PropTypes from 'prop-types';
import {
  Create, Edit, List,
  SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput, // Create
  DisabledInput, FunctionField, // Edit
  Datagrid, DateField, SelectField, BooleanField, TextField, EditButton, DeleteButton, // List
  TabbedForm, FormTab, ReferenceManyField
} from 'react-admin';
import { Chip, Icon } from '@material-ui/core';

import MarkdownInput from 'components/MarkdownInput';

const EventTitle = ({ record }) => {
  return <span>Událost: {record ? `"${record.name}"` : ''}</span>;
};

EventTitle.propTypes = {
  record: PropTypes.object.isRequired
};

const required = value => value ? undefined : 'Required';

const EventCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <TextInput label="ID" source="id" />
      <TextInput label='Název' source="name" validate={ required } />
      <NumberInput label='Rok konání' source="year" />
      <SelectInput label='Tag' source="type"
        choices={ [
          { id: true, name: 'Bitva' },
          { id: false, name: 'Šarvátka' }
        ] }
      />
      <MarkdownInput label='Titulek' source="description" />
      <BooleanInput label='Zobrazitelné' source="display" />
      <BooleanInput label='Otevřená registrace' source="registrationAvailable" />
    </SimpleForm>
  </Create>
);

const EventEdit = (props) => (
  <Edit title={ <EventTitle /> } { ...props }>
    <TabbedForm>
      <FormTab label="Obecné">
        <DisabledInput label="ID" source="id" />
        <TextInput label='Název' source="name" validate={ required } />
        <NumberInput label='Rok konání' source="year"/>
        <SelectInput label='Tag' source="type"
          choices={ [
            { id: true, name: 'Bitva' },
            { id: false, name: 'Šarvátka' }
          ] }
        />
        <MarkdownInput label='Titulek' source="description" />
        <BooleanInput label='Zobrazitelné' source="display" />
        <BooleanInput label='Otevřená registrace' source="registrationAvailable" />
      </FormTab>
      <FormTab label="Pravidla">
        <MarkdownInput addLabel={ false } source="rules" />
      </FormTab>
      <FormTab label="Strany">
        <ReferenceManyField reference='races' target='event' addLabel={ false }>
          <Datagrid>
            <TextField label='Název' source="name" />
            <TextField label='Limit' source="limit" />
            <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{ image ? 'check' : 'close' }</Icon> }/>
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>
      <FormTab label="Účastníci">
        <ReferenceManyField reference='participants' target='event' addLabel={ false }>
          <Datagrid>
            <TextField label='nickName' source="Přezdívka" />
            <TextField label='firstName' source="Jméno" />
            <TextField label='lastName' source="Příjmení" />
            <TextField label='race' source="Strana" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>
    </TabbedForm>
  </Edit>
);

const ChipField = ({ record }) => <Chip label={ record.name } />;

ChipField.propTypes = {
  record: PropTypes.object.isRequired
};

const EventList = (props) => (
  <List { ...props }>
    <Datagrid>
      <TextField label='Název' source="name" />
      <TextField label='Rok konání' source="year" />
      <SelectField label='Tag' source="type"
        optionText={ <ChipField /> }
        choices={ [
          { id: true, name: 'Bitva' },
          { id: false, name: 'Šarvátka' }
        ] }
      />
      <TextField label='Titulek' source="description" />
      <BooleanField label='Zobrazitelné' source="display" />
      <BooleanField label='Otevřená registrace' source="registrationAvailable" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <DeleteButton />
      <EditButton basePath="/events" />
    </Datagrid>
  </List>
);

// const EventShow = (props) => (
// );

export default {
  Create: EventCreate,
  Edit: EventEdit,
  List: EventList
  // Show: EventShow
};
