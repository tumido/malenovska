import React from 'react';
import {
  List as ListBase,
  Datagrid, Filter, FormDataConsumer,
  ReferenceInput, SelectInput,
  TextField, ReferenceField,
  EditButton, ShowButton,
  downloadCSV
} from 'react-admin';
import { unparse as convertToCSV } from 'papaparse/papaparse.min';

import { getPrivateSubDocument } from './shared';
import { LocaleDateField } from '../shared';

const LegendFilter = (props) => (
  <Filter { ...props }>
    <ReferenceInput source='event' reference='events' label='Událost' alwaysOn>
      <SelectInput source='name'/>
    </ReferenceInput>
    <FormDataConsumer>
      {({ formData: { event }}) =>
        <ReferenceInput source='race' reference='races' label='Strana' filter={ { event } }>
          <SelectInput source='name'/>
        </ReferenceInput>
      }
    </FormDataConsumer>
  </Filter>
);

const getData = async (participants, races) => {
  return await Promise.all(participants.map(p =>
    getPrivateSubDocument(p).then(({ age }) => [
      races[p.race].name,
      p.group,
      p.firstName,
      p.nickName,
      p.lastName,
      age
    ])
  ));
};

const exporter = (participants, fetchRelatedRecords) => {
  fetchRelatedRecords(participants, 'race', 'races').then(races => {
    getData(participants, races).then(data => {
      const csv = convertToCSV({
        data,
        fields: [ 'Strana', 'Skupina', 'Jméno', 'Přezdívka', 'Příjmení', 'Věk' ]
      });
      downloadCSV(csv, 'registrace');
    });
  });
};

const List = (props) => (
  <ListBase
    title="Účastníci"
    filters={ <LegendFilter /> }
    exporter={ exporter }
    { ...props }
  >
    <Datagrid>
      <TextField label='Jméno' source="firstName" />
      <TextField label='Příjmení' source="lastName" />
      <TextField label='Přezdívka' source="nickName" />
      <ReferenceField label='Událost' source="event" reference='events'>
        <TextField source='name' />
      </ReferenceField>
      <TextField label='Skupina' source="group" />
      <ReferenceField label='Strana' source="race" reference='races'>
        <TextField source='name' />
      </ReferenceField>
      <LocaleDateField label="Vytvořeno" source="createdate" />
      <LocaleDateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
