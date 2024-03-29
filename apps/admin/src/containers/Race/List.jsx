import React from 'react';
import {
  List as ListBase,
  Datagrid,
  FunctionField, TextField, ReferenceField,
  EditButton, ShowButton
} from 'react-admin';

import Icon from '@mui/material/Icon';

import { EventFilter } from "../../components/EventFilter";
import { LocaleDateField } from "../../components/LocaleDateField";

const List = (props) => (
  <ListBase
    title='Strany'
    filters={ <EventFilter /> }
    { ...props }
  >
    <Datagrid>
      <TextField label='Jméno' source="name" />
      <ReferenceField label='Událost' source="event" reference='events'>
        <TextField source="name" />
      </ReferenceField>
      <TextField label='Limit' source="limit" />
      <TextField label='Pořadí v registraci' source="priority" />
      <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{ image ? 'check' : 'close' }</Icon> }/>
      <TextField label='Barva' source='color'/>
      <TextField label="Autor" source="createdby" />
      <LocaleDateField label="Vytvořeno" source="createdate" />
      <LocaleDateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
