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
          {({ formData: { firstName, lastName, nickName, event }, ...rest }) =>
            <TextInput
              label="ID"
              source="id"
              value={`${event}:${firstName}-${nickName}-${lastName}`}
              {...rest}
              disabled
            />
          }
        </FormDataConsumer>
        <ReferenceInput {...props} label="Událost" source="event" reference="events" formClassName={classes.inlineBlock}>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput {...props} label="Strana" source="race" reference="races" formClassName={classes.inlineBlock}>
          <SelectInput optionText="name" />
        </ReferenceInput>
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
