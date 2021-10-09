import React from "react";
import {
  Show as ShowBase,
  SimpleForm,
  TextField,
  ReferenceField,
  NumberField,
  ImageField,
  required,
} from "react-admin";

import MarkdownField from "components/MarkdownField";
import { RaceTitle } from "./shared";
import { useStyles } from "../shared";

const Show = (props) => {
  const classes = useStyles();

  return (
    <ShowBase title={<RaceTitle />} {...props}>
      <SimpleForm>
        <TextField
          label="Název"
          source="name"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <ReferenceField
          label="Událost"
          source="event"
          reference="events"
          formClassName={classes.inlineBlock}
        >
          <TextField source="name" formClassName={classes.inlineBlock} />
        </ReferenceField>
        <NumberField
          label="Limit"
          source="limit"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <TextField
          label="Barva"
          source="color"
          picker="Sketch"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <TextField
          label="Název barvy"
          source="colorName"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <MarkdownField label="Legenda" source="legend" validate={required()} />
        <MarkdownField
          label="Požadavky"
          source="requirements"
          validate={required()}
        />
        <ImageField source="image.src" title="image.title" />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
