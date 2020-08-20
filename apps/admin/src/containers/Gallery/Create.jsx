import React from 'react';
import PropTypes from 'prop-types';
import {
  Create as CreateBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, ImageInput, ImageField,
  useNotify, useRedirect,
  required
} from 'react-admin';

import { useStyles, setCacheForRecord } from '../shared';

const Create = (props) => {
  const classes = useStyles();

  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: 'galleries',
    records: [ 'cover' ],
    isCreate: true,
    basePath: props.basePath,
    redirectTo, notify
  });

  return (
    <CreateBase onSuccess={ onSuccess } title="Nová galerie" { ...props }>
      <SimpleForm>
        <ReferenceInput label="Událost" source="event" reference="events" validate={ required() } formClassName={ classes.inlineBlock }>
          <SelectInput optionText="name" validate={ required() }/>
        </ReferenceInput>
        <TextInput label='Název' source="name" validate={ required() }  formClassName={ classes.inlineBlock }/>
        <TextInput label='Autor' source="author"  validate={ required() } formClassName={ classes.inlineBlock }/>
        <TextInput label='Odkaz' source="url"  validate={ required() } fullWidth/>
        <ImageInput label='Úvodní fotka' validate={ required() } source='cover'>
          <ImageField source="src" />
        </ImageInput>
        <TextInput label='Úvodní fotka jako odkaz' source="cover.src" />
      </SimpleForm>
    </CreateBase>
  );
};

Create.propTypes = {
  basePath: PropTypes.string
};

export default Create;
