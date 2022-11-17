import React from "react";
import {
  Filter,
  ReferenceInput,
  SelectInput
} from "react-admin";


export const EventFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput source="event" reference="events" label="Událost" alwaysOn>
      <SelectInput source="name" label="Událost" optionText="name" />
    </ReferenceInput>
  </Filter>
);
