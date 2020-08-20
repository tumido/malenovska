import React from 'react';
import PropTypes from 'prop-types';
import {
  Edit as EditBase,
  SimpleForm,
  TextInput, ReferenceInput, SelectInput, ImageInput, ImageField,
  useNotify, useRedirect,
  required
} from 'react-admin';

import { GalleryTitle } from './shared';
import { useStyles, setCacheForRecord  } from '../shared';

const Edit = (props) => {
  const classes = useStyles();

  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: 'galleries',
    records: [ 'cover' ],
    isCreate: false,
    basePath: props.basePath,
    redirectTo, notify
  });

  return (
    <EditBase onSuccess={ onSuccess } undoable={ false } title={ <GalleryTitle /> } { ...props }>
      <SimpleForm>
        <ReferenceInput label="Událost" source="event" reference="events" validate={ required() }  formClassName={ classes.inlineBlock }>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput label='Název' source="name" validate={ required() }  formClassName={ classes.inlineBlock }/>
        <TextInput label='Autor' source="author" validate={ required() } formClassName={ classes.inlineBlock }/>
        <TextInput label='Odkaz' source="url" validate={ required() } fullWidth/>
        <ImageInput label='Úvodní fotka' source='cover'>
          <ImageField source="src" />
        </ImageInput>
        <TextInput label='Úvodní fotka jako odkaz' source="cover.src" />
      </SimpleForm>
    </EditBase>
  );
};

Edit.propTypes = {
  basePath: PropTypes.string
};

export default Edit;
