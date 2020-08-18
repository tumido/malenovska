import React from 'react';
import {
  Filter,
  ReferenceInput, SelectInput
} from 'react-admin';

import firebase from 'firebase/app';
import { makeStyles } from '@material-ui/core/styles';

export const EventFilter = (props) => (
  <Filter { ...props }>
    <ReferenceInput source='event' reference='events' label='Událost' alwaysOn>
      <SelectInput source='name' optionText='name'/>
    </ReferenceInput>
  </Filter>
);

export const useStyles = makeStyles({
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' }
});

const metadata = {
  cacheControl: 'public, max-age=31536000'
};

export const setCacheForRecord = ({
  collection, records, isCreate, notify, redirectTo, basePath
}) => ({ data }) => {
  const storageRef = firebase.app().storage().ref();
  records.map(r => {
    if (!(r in data)) {return;}

    const key = `${collection}/${data.id}/${r}`;
    console.log('Setting cache for updated image: ', key);

    return storageRef.child(key).updateMetadata(metadata);
  });

  notify(isCreate ? 'ra.notification.created' : 'ra.notification.updated', 'info',{ smart_count: 1 } ); //eslint-disable-line
  redirectTo(isCreate ? 'edit' : 'list', basePath, data.id, data);
};

export default {
  EventFilter
};
