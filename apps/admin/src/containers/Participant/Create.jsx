import React from 'react';
import {
  Create as CreateBase,
  SimpleForm, FormDataConsumer,
  TextInput, ReferenceInput, SelectInput,
  required
} from 'react-admin';

import { useStyles } from '../shared';

const Create = (props) => {
  const classes = useStyles();

  return (
    <CreateBase title="Nový účastník" {...props}>
      <SimpleForm>
        <FormDataConsumer formClassName={classes.inlineBlock}>
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
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={classes.inlineBlock}>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput label="Strana" source="race" reference="races" formClassName={classes.inlineBlock}>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <br />
        <TextInput label='Jméno' source="firstName" validate={required()}  formClassName={classes.inlineBlock}/>
        <TextInput label='Přezdívka' source="nickName"  formClassName={classes.inlineBlock}/>
        <TextInput label="Příjmení" source="lastName" validate={required()}  formClassName={classes.inlineBlock}/>
        <br />
        <TextInput label='Skupina' source="group" fullWidth/>
      </SimpleForm>
    </CreateBase>
  )
};

export default Create;
