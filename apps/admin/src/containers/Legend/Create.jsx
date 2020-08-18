import React from 'react';
import PropTypes from 'prop-types';
import {
  Create as CreateBase,
  SimpleForm, FormDataConsumer,
  TextInput, DateInput, ReferenceInput, SelectInput, ImageInput,
  ImageField,
  useNotify, useRedirect,
  maxLength, required
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';
import SaveWithTransformToolbar from 'components/SaveWithTransformToolbar';

import { useStyles, setCacheForRecord } from '../shared';

const Create = (props) => {
  const classes = useStyles();
  const transform = ({ title }) => title && title.replace(/ /g, '_').toLowerCase().replace(/\W/g, '');

  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: 'legends',
    records: [ 'image' ],
    isCreate: true,
    basePath: props.basePath,
    redirectTo, notify
  });

  return (
    <CreateBase onSuccess={ onSuccess } title="Nová legenda" { ...props }>
      <SimpleForm toolbar={ <SaveWithTransformToolbar transform={ data => ({ ...data, id: transform({ title: data.title }) }) } /> }>
        <FormDataConsumer formClassName={ classes.inlineBlock }>
          {({ formData: { title }, ...rest }) =>
            <TextInput
              label="ID"
              source="id"
              value={ transform({ title }) || '' }
              { ...rest }
              disabled
            />
          }
        </FormDataConsumer>
        <TextInput label='Název' source="title" defaultValue='' validate={ required() } formClassName={ classes.inlineBlock } />
        <ReferenceInput label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <DateInput label="Publication date" source="published_at" defaultValue={ new Date() } formClassName={ classes.inlineBlock } />
        <TextInput label='Perex' source="perex" defaultValue='' validate={ [ required(), maxLength(200) ] } fullWidth />
        <MarkdownInput label='Obsah' source="content" validate={ required() } />
        <ImageInput source="image" label="Obrázek">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </CreateBase>
  );
};

Create.propTypes = {
  basePath: PropTypes.string
};

export default Create;
