import React from 'react';
import {
  List as ListBase,
  Datagrid, Filter,
  ReferenceInput, SelectInput,
  DateField, TextField,
  EditButton, DeleteButton
} from 'react-admin';

const LegendFilter = (props) => (
  <Filter { ...props }>
    <ReferenceInput source='event' reference='events' label='Událost' alwaysOn>
      <SelectInput source='name' optionText='name'/>
    </ReferenceInput>
  </Filter>
);

const List = (props) => (
  <ListBase title="Legendy a příběhy" { ...props } filters={ <LegendFilter /> }>
    <Datagrid>
      <TextField label='Název' source="title" />
      <TextField label='Událost' source="event" />
      <TextField label="Autor" source="createdby" />
      <DateField label="Vytvořeno" source="createdate" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <DeleteButton />
      <EditButton basePath="/legends" />
    </Datagrid>
  </ListBase>
);

export default List;
