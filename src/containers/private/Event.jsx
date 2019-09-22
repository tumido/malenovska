import React from 'react';
import PropTypes from 'prop-types';
import {
  Create, Edit, List,
  SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput,
  DisabledInput, FunctionField, FileInput, FileField,
  Datagrid, DateField, SelectField, BooleanField, TextField, EditButton, DeleteButton,
  TabbedForm, FormTab, ReferenceManyField,
  required
} from 'react-admin';
import { Chip, Icon } from '@material-ui/core';

import MarkdownInput from 'components/MarkdownInput';

const EventTitle = ({ record }) => {
  return <span>Událost: {record ? `"${record.name}"` : ''}</span>;
};

EventTitle.propTypes = {
  record: PropTypes.object.isRequired
};

const EventCreate = (props) => (
  <Create { ...props }>
    <SimpleForm>
      <TextInput label="ID" source="id" />
      <TextInput label='Název' source="name" validate={ required() } />
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
        <TextInput label='Název' source="name" validate={ required() } />
        <NumberInput label='Rok konání' source="year"/>
        <NumberInput label='Rok konání' source="year"/>
        <SelectInput label='Tag' source="type"
          choices={ [
            { id: true, name: 'Bitva' },
            { id: false, name: 'Šarvátka' }
          ] }
        />
        <MarkdownInput label='Titulek' source="description" />
        <BooleanInput label='Zobrazitelné' source="display" />
      </FormTab>
      <FormTab label="Pravidla">
        <MarkdownInput addLabel={ false } source="rules" />
        <FileInput label="Obrázek" source="rules_image">
          <FileField source="src" title="title" />
        </FileInput>
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
      <FormTab label="Registrace">
        <BooleanInput label='Otevřená registrace' source="registrationAvailable" />
        <MarkdownInput label='Úvod: Nahoře' source="registrationBeforeAbove" />
        <MarkdownInput label='Úvod: Dole' source="registrationBeforeBelow" />
        <MarkdownInput label='Úspěšná registrace' source="registrationAfter" />
        <MarkdownInput label='Přihlášení účastníci' source="registrationList" />
      </FormTab>
      <FormTab label="Ostatní">
        <FileInput label="Potvrzení pro nezletilé" source="declaration" accept="application/pdf">
          <FileField source="src" title="title" />
        </FileInput>
        <NumberInput label='Cena' source="price"/>
        {/* <DateTimeInput source='times.date' format={v => v.toDate()} parse={v => v.fromDate()}/> */}
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
