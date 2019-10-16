import React from 'react';
import {
  List as ListBase,
  Datagrid, Filter,
  ReferenceInput, SelectInput,
  FunctionField, DateField, TextField, ReferenceField,
  EditButton, DeleteButton
} from 'react-admin';
import { ColorField } from 'react-admin-color-input';

import { Icon } from '@material-ui/core';

const RaceFilter = (props) => (
  <Filter { ...props }>
    <ReferenceInput source='event' reference='events' label='Událost' alwaysOn>
      <SelectInput source='name' optionText='name'/>
    </ReferenceInput>
  </Filter>
);

const List = (props) => (
  <ListBase title='Strany' { ...props } filters={ <RaceFilter /> }>
    <Datagrid>
      <TextField label='Jméno' source="name" />
      <ReferenceField label='Událost' source="event" reference='events'>
        <TextField source="name" />
      </ReferenceField>
      <TextField label='Limit' source="limit" />
      <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{ image ? 'check' : 'close' }</Icon> }/>
      <ColorField label='Barva' source='color'/>
      <TextField label="Autor" source="createdby" />
      <DateField label="Vytvořeno" source="createdate" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <DeleteButton />
      <EditButton basePath="/races" />
    </Datagrid>
  </ListBase>
);

export default List;
