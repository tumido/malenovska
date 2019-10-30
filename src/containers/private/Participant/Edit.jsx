import React from 'react';
import {
  Edit as EditBase,
  SimpleForm, FormDataConsumer,
  TextInput, ReferenceInput, SelectInput, DisabledInput,
  required
} from 'react-admin';

import { ParticipantTitle } from './shared';

const Edit = (props) => (
  <EditBase title={ <ParticipantTitle /> } { ...props }>
    <SimpleForm>
      <FormDataConsumer>
        {({ formData: { firstName, lastName, nickName, event }, ...rest }) =>
          <DisabledInput
            label="ID"
            source="id"
            defaultValue={ `${event}:${firstName}-${nickName}-${lastName}` }
            { ...rest }
          />
        }
      </FormDataConsumer>
      <ReferenceInput label="Událost" source="event" reference="events">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput label="Příjmení" source="lastName" validate={ required() } />
      <TextInput label='Jméno' source="firstName" validate={ required() } />
      <TextInput label='Přezdívka' source="nickName" />
      <TextInput label='Skupina' source="group" />
      <ReferenceInput label="Strana" source="race" reference="races">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </EditBase>
);

export default Edit;
