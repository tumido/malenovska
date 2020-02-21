import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, FunctionField
} from 'react-admin';
import firebase from 'firebase/app';

import { ParticipantTitle, getAge } from './shared';
import { useStyles } from '../shared';

const Show = (props) => {
  const classes = useStyles();

  return (
    <ShowBase title={<ParticipantTitle />} {...props}>
      <SimpleForm>
        <TextField label="ID" source="id" formClassName={classes.inlineBlock} />
        <ReferenceField label="Událost" source="event" reference="events" formClassName={classes.inlineBlock}>
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField label="Strana" source="race" reference="races" formClassName={classes.inlineBlock}>
          <TextField source="name" />
        </ReferenceField>
        <br />
        <TextField label='Jméno' source="firstName" formClassName={classes.inlineBlock} />
        <TextField label='Přezdívka' source="nickName" formClassName={classes.inlineBlock} />
        <TextField label='Příjmení' source="lastName" formClassName={classes.inlineBlock} />
        <br />
        <TextField label='Skupina' source="group" fullWidth/>
        <br />
        {/* <FunctionField label='Věk' render={record => <span>{ getAge(firebase, record) }</span>} /> */}
      </SimpleForm>
    </ShowBase>
  )
};

export default Show;
