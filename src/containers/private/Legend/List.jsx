import React from 'react';
import {
  List as ListBase,
  Datagrid, Filter,
  ReferenceInput, SelectInput,
  DateField, TextField, ReferenceField,
  EditButton, ShowButton
} from 'react-admin';

const LegendFilter = (props) => (
  <Filter { ...props }>
    <ReferenceInput source='event' reference='events' label='Událost' alwaysOn>
      <SelectInput source='name' optionText='name'/>
    </ReferenceInput>
  </Filter>
);

const List = (props) => (
  <ListBase
    title="Legendy a příběhy"
    filters={ <LegendFilter /> }
    { ...props }
  >
    <Datagrid>
      <TextField label='Název' source="title" />
      <ReferenceField label='Událost' source="event" reference='events'>
        <TextField source='name' />
      </ReferenceField>
      <TextField label='Perex' source="perex" />
      <TextField label="Autor" source="createdby" />
      <DateField label="Vytvořeno" source="createdate" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
