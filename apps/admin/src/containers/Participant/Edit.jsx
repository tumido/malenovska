import React from 'react';
import {
  Edit as EditBase,
  SimpleForm, FormDataConsumer,
  TextInput, ReferenceInput, SelectInput,
  required
} from 'react-admin';

import { ParticipantTitle } from './shared';
import { useStyles } from '../shared';


const Edit = (props) => {
  const classes = useStyles();

  return (
    <EditBase title={<ParticipantTitle />} {...props}>
      <SimpleForm>
        <FormDataConsumer {...props} formClassName={classes.inlineBlock}>
          {({ formData: { firstName, lastName, nickName, event } }) =>
            <TextInput
              label="ID"
              source="id"
              value={`${event}:${firstName}-${nickName}-${lastName}`}
              disabled
            />
          }
        </FormDataConsumer>
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={classes.inlineBlock}>
          <SelectInput disabled optionText="name" />
        </ReferenceInput>
        <FormDataConsumer {...props} formClassName={classes.inlineBlock}>
          {({ formData: { event } }) =>
            <ReferenceInput
              label="Strana"
              source="race"
              reference="races"
              filter={ { event: event }}
              formClassName={classes.inlineBlock}>
              <SelectInput optionText="name" />
            </ReferenceInput>
          }
        </FormDataConsumer>
        <br />
        <TextInput label='Jméno' source="firstName" validate={required()} formClassName={classes.inlineBlock} />
        <TextInput label='Přezdívka' source="nickName" formClassName={classes.inlineBlock} />
        <TextInput label="Příjmení" source="lastName" validate={required()} formClassName={classes.inlineBlock} />
        <br />
        <TextInput label='Skupina' source="group" fullWidth/>
      </SimpleForm>
    </EditBase>
  )
};

export default Edit;
