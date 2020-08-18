import React from 'react';
import {
  Filter,
  ReferenceInput, SelectInput
} from 'react-admin';

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

export const setCacheForRecord = ({
  records, isCreate, notify, redirectTo, redirect, basePath
}) => ({ data }) => {
  console.log('setting cache', data, records, basePath, redirect);
  notify(
    isCreate ? 'ra.notification.created' : 'ra.notification.updated',
    'info',
    { smart_count: 1 }  //eslint-disable-line
  );
  redirectTo(isCreate ? 'edit' : 'list', basePath, data.id, data);
};

export default {
  EventFilter
};
