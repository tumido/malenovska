import React from 'react';
import {
  Show as ShowBase,
  SimpleForm,
  TextField, ReferenceField, ImageField
} from 'react-admin';

import MarkdownField from 'components/MarkdownField';

import { LegendTitle } from './shared';
import { useStyles } from '../shared';

const Show = (props) => {
  const classes = useStyles();

  return (
    <ShowBase title={ <LegendTitle /> } { ...props }>
      <SimpleForm>
        <TextField label="ID" source="id" formClassName={ classes.inlineBlock } />
        <TextField label='Název' source="title" formClassName={ classes.inlineBlock } />
        <ReferenceField label="Událost" source="event" reference="events" formClassName={ classes.inlineBlock }>
          <TextField source="name" />
        </ReferenceField>
        <TextField label='Perex' source="perex" defaultValue='' fullWidth />
        <MarkdownField label='Obsah' source="content" />
        <ImageField source="image.src" label="Obrázek" />
      </SimpleForm>
    </ShowBase>
  );
};

export default Show;
