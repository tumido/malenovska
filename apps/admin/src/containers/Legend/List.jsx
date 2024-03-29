import React from 'react';
import {
  List as ListBase,
  Datagrid,
  TextField, ReferenceField, FunctionField,
  EditButton, ShowButton
} from 'react-admin';
import { truncate } from 'lodash/string';

import { EventFilter } from "../../components/EventFilter";
import { LocaleDateField } from "../../components/LocaleDateField";

const List = (props) => (
  <ListBase
    title="Legendy a příběhy"
    filters={ <EventFilter /> }
    { ...props }
  >
    <Datagrid>
      <TextField label='Název' source="title" />
      <ReferenceField label='Událost' source="event" reference='events'>
        <TextField source='name' />
      </ReferenceField>
      <FunctionField label='Perex' render={ record => truncate(record.perex, { length: 60, separator: ' ' }) } />
      <TextField label="Autor" source="createdby" />
      <LocaleDateField label="Publikováno" source="publishedAt" />
      <LocaleDateField label="Vytvořeno" source="createdate" />
      <LocaleDateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
