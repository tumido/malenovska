import React from "react";
import {
  Show as ShowBase,
  SimpleForm,
  TextField,
  ReferenceField,
  FunctionField,
  useShowController,
} from "react-admin";

import { ParticipantTitle, getPrivateSubDocument } from "./shared";
import { inlineBlock } from '../shared';

const Show = (props) => {
  const [privateData, setPrivateData] = React.useState({});

  const { record } = useShowController(props);
  React.useEffect(() => {
    record &&
      getPrivateSubDocument(record).then((data) => setPrivateData(data));
  });

  return (
    <ShowBase title={<ParticipantTitle />} {...props}>
      <SimpleForm>
        <TextField label="ID" source="id" sx={inlineBlock} />
        <ReferenceField
          label="Událost"
          source="event"
          reference="events"
          sx={inlineBlock}
        >
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField
          label="Strana"
          source="race"
          reference="races"
          sx={inlineBlock}
        >
          <TextField source="name" />
        </ReferenceField>
        <br />
        <TextField
          label="Jméno"
          source="firstName"
          sx={inlineBlock}
        />
        <TextField
          label="Přezdívka"
          source="nickName"
          sx={inlineBlock}
        />
        <TextField
          label="Příjmení"
          source="lastName"
          sx={inlineBlock}
        />
        <FunctionField
          label="Věk"
          render={() => privateData.age}
          sx={inlineBlock}
        />
        <FunctionField
          label="E-Mail"
          render={() => privateData.email}
          sx={inlineBlock}
        />
        <br />
        <TextField label="Skupina" source="group" fullWidth />
        <TextField label="Poznámka" source="note" fullWidth />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
