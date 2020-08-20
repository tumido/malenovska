import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, UrlField, ImageField
} from 'react-admin';

import { GalleryTitle } from './shared';
import { useStyles } from '../shared';

const Show = (props) => {
  const classes = useStyles();

  return (
    <ShowBase title={ <GalleryTitle /> } { ...props }>
      <SimpleForm>
        <ReferenceField label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <TextField source="name" />
        </ReferenceField>
        <TextField label='Autor' source="author" formClassName={ classes.inlineBlock } />
        <br />
        <UrlField label='Odkaz' source="url" fullWidth />
        <ImageField label='Úvodní fotka' source="image.src" />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
