import React from "react";
import PropTypes from "prop-types";
import {
  Create as CreateBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  NumberInput,
  ImageField,
  useNotify,
  useRedirect,
  required,
} from "react-admin";

import MarkdownInput from "components/MarkdownInput";
import { useStyles, setCacheForRecord } from "../shared";

const Create = (props) => {
  const classes = useStyles();

  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: "races",
    records: ["image"],
    isCreate: true,
    basePath: props.basePath,
    redirectTo,
    notify,
  });

  return (
    <CreateBase onSuccess={onSuccess} title="Nová strana" {...props}>
      <SimpleForm>
        <TextInput
          label="Název"
          source="name"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <ReferenceInput
          label="Událost"
          source="event"
          reference="events"
          formClassName={classes.inlineBlock}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput
          label="Limit"
          source="limit"
          validate={required()}
          formClassName={classes.inlineBlock}
        />
        <NumberInput
          label="Pořadí v registraci"
          source="priority"
          defaultValue="1"
          formClassName={classes.inlineBlock}
        />
        <TextInput
          label="Barva"
          source="color"
          picker="Sketch"
          validate={required()}
        />
        <TextInput
          label="Název barvy"
          source="colorName"
          validate={required()}
        />
        <MarkdownInput label="Legenda" source="legend" validate={required()} />
        <MarkdownInput
          label="Požadavky"
          source="requirements"
          validate={required()}
        />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </CreateBase>
  );
};

Create.propTypes = {
  basePath: PropTypes.string,
};

export default Create;
