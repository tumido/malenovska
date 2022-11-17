import React from 'react';
import {
  List as ListBase,
  Datagrid, Filter, FormDataConsumer,
  ReferenceInput, SelectInput,
  TextField, ReferenceField,
  EditButton, ShowButton
} from 'react-admin';
import { LocaleDateField } from '../shared';
import { EventFilter } from '../shared';

const List = (props) => (
  <ListBase
    title="Účastníci"
    filters={ <EventFilter /> }
    { ...props }
  >
    <Datagrid>
      <TextField label='Název' source="name" />
      <TextField label='Autor' source="author" />
      <ReferenceField label='Událost' source="event" reference='events'>
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
