import React from "react";
import PropTypes from "prop-types";
import {
  Edit as EditBase,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  useNotify,
  useRedirect,
  maxLength,
  DateInput,
  required,
} from "react-admin";

import MarkdownInput from "../../components/MarkdownInput";
import { LegendTitle } from "./shared";
import { inlineBlock, setCacheForRecord } from "../shared";

const Edit = (props) => {
  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: "legends",
    records: ["image"],
    isCreate: true,
    basePath: props.basePath,
    redirectTo,
    notify,
  });

  return (
    <EditBase
      onSuccess={onSuccess}
      undoable={false}
      title={<LegendTitle />}
      {...props}
    >
      <SimpleForm>
        <TextInput label="ID" source="id" disabled sx={inlineBlock} />
        <TextInput
          label="Název"
          source="title"
          validate={required()}
          sx={inlineBlock}
        />
        <ReferenceInput
          label="Událost"
          source="event"
          reference="events"
          sx={inlineBlock}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <DateInput
          label="Datum publikace"
          source="publishedAt"
          sx={inlineBlock}
        />
        <TextInput
          label="Perex"
          source="perex"
          defaultValue=""
          validate={[required(), maxLength(200)]}
          fullWidth
        />
        <MarkdownInput label="Obsah" source="content" validate={required()} />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </EditBase>
  );
};

Edit.propTypes = {
  basePath: PropTypes.string,
};

export default Edit;
