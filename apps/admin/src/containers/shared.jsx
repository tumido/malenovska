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
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

export default {
  EventFilter
};
