import React from "react";
import {
  Filter,
  ReferenceInput,
  SelectInput,
  DateField,
  useLocaleState,
} from "react-admin";

export const EventFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput source="event" reference="events" label="Událost" alwaysOn>
      <SelectInput source="name"  label="Událost" optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const LocaleDateField = (props) => {
  const [locale] = useLocaleState();

  return <DateField {...props} locales={locale} />;
};

LocaleDateField.defaultProps = {
  addLabel: true,
};

export const inlineBlock = { display: "inline-flex", m: 0, mr: "1rem" }

export default {
  EventFilter,
  LocaleDateField,
};
