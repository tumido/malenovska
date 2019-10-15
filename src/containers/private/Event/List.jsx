import React from 'react';
import {
  List as ListBase,
  Datagrid,
  DateField, SelectField, BooleanField, TextField,
  EditButton, CloneButton
} from 'react-admin';

import { ChipField } from './shared';

const List = (props) => (
  <ListBase  title='Události' { ...props }>
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
      <EditButton basePath="/events" />
      <CloneButton />
    </Datagrid>
  </ListBase>
);

export default List;
