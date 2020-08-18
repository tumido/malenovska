import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, FunctionField,
  useShowController
} from 'react-admin';

import { ParticipantTitle, getAge } from './shared';
import { useStyles } from '../shared';

const Show = (props) => {
  const classes = useStyles();
  const [ age, setAge ] = React.useState('');

  const { record } = useShowController(props);
  React.useEffect(() => {
    record && getAge(record).then(age => setAge(age));
  });

  return (
    <ShowBase title={ <ParticipantTitle /> } { ...props }>
      <SimpleForm>
        <TextField label="ID" source="id" formClassName={ classes.inlineBlock } />
        <ReferenceField label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField label="Strana" source="race" reference="races" formClassName={ classes.inlineBlock }>
          <TextField source="name" />
        </ReferenceField>
        <br />
        <TextField label='Jméno' source="firstName" formClassName={ classes.inlineBlock } />
        <TextField label='Přezdívka' source="nickName" formClassName={ classes.inlineBlock } />
        <TextField label='Příjmení' source="lastName" formClassName={ classes.inlineBlock } />
        <FunctionField label='Věk' render={ () => age } formClassName={ classes.inlineBlock } />
        <br />
        <TextField label='Skupina' source="group" fullWidth />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
