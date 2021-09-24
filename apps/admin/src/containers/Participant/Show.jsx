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
import { useStyles } from "../shared";

const Show = (props) => {
  const classes = useStyles();
  const [privateData, setPrivateData] = React.useState({});

  const { record } = useShowController(props);
  React.useEffect(() => {
    record &&
      getPrivateSubDocument(record).then((data) => setPrivateData(data));
  });

  return (
    <ShowBase title={<ParticipantTitle />} {...props}>
      <SimpleForm>
        <TextField label="ID" source="id" formClassName={classes.inlineBlock} />
        <ReferenceField
          label="Událost"
          source="event"
          reference="events"
          formClassName={classes.inlineBlock}
        >
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField
          label="Strana"
          source="race"
          reference="races"
          formClassName={classes.inlineBlock}
        >
          <TextField source="name" />
        </ReferenceField>
        <br />
        <TextField
          label="Jméno"
          source="firstName"
          formClassName={classes.inlineBlock}
        />
        <TextField
          label="Přezdívka"
          source="nickName"
          formClassName={classes.inlineBlock}
        />
        <TextField
          label="Příjmení"
          source="lastName"
          formClassName={classes.inlineBlock}
        />
        <FunctionField
          label="Věk"
          render={() => privateData.age}
          formClassName={classes.inlineBlock}
        />
        <FunctionField
          label="E-Mail"
          render={() => privateData.email}
          formClassName={classes.inlineBlock}
        />
        <br />
        <TextField label="Skupina" source="group" fullWidth />
        <TextField label="Poznámka" source="note" fullWidth />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
