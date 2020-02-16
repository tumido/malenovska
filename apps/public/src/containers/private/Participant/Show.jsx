import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField
} from 'react-admin';

import { ParticipantTitle } from './shared';

const Show = (props) => (
  <ShowBase title={ <ParticipantTitle /> } { ...props }>
    <SimpleForm>
      <TextField label="ID" source="id" />
      <ReferenceField label="Událost" source="event" reference="events">
        <TextField source="name" />
      </ReferenceField>
      <TextField label='Jméno' source="firstName" />
      <TextField label='Příjmení' source="lastName" />
      <TextField label='Přezdívka' source="nickName" />
      <TextField label='Skupina' source="group" />
      <ReferenceField label="Strana" source="race" reference="races">
        <TextField optionText="name" />
      </ReferenceField>
    </SimpleForm>
  </ShowBase>
);

export default Show;
