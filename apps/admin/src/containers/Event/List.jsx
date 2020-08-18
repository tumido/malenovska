import React from 'react';
import {
  List as ListBase,
  Datagrid,
  DateField, SelectField, BooleanField, TextField, FunctionField,
  EditButton, ShowButton, CloneButton
} from 'react-admin';
import { truncate } from 'lodash/string';

import { ChipField } from './shared';

const List = (props) => (
  <ListBase title='Události' { ...props }>
    <Datagrid>
      <TextField label='Název' source="name" />
      <TextField label='Rok' source="year" />
      <SelectField label='Tag' source="type"
        optionText={ <ChipField /> }
        choices={ [
          { id: true, name: 'Bitva' },
          { id: false, name: 'Šarvátka' }
        ] }
      />
      <FunctionField label='Titulek' render={ record => truncate(record.description.replace(/\n/gm, ''), { length: 40, separator: ' ' }) } />
      <BooleanField label='Zobrazitelné' source="display" />
      <BooleanField label='Registrace' source="registrationAvailable" />
      <DateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <CloneButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
