import React from "react";
import {
  List as ListBase,
  Datagrid,
  Filter,
  ReferenceInput,
  SelectInput,
  TextField,
  ReferenceField,
  FunctionField,
  BooleanField,
  EditButton,
  ShowButton,
  downloadCSV,
} from "react-admin";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import { truncate } from "lodash/string";

import { getPrivateSubDocument } from "./shared";
import { LocaleDateField } from "../shared";

const ParticipantFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput source="event" reference="events" label="Událost" alwaysOn>
      <SelectInput source="name" />
    </ReferenceInput>
    <ReferenceInput
      source="race"
      reference="races"
      label="Strana"
      filter={
        props.filterValues.event ? { event: props.filterValues.event } : {}
      }
      alwaysOn
    >
      <SelectInput source="name" />
    </ReferenceInput>
  </Filter>
);

const getData = async (participants, races) => {
  return await Promise.all(
    participants.map((p) =>
      getPrivateSubDocument(p).then(({ age, email }) => [
        races[p.race].name,
        p.group,
        p.firstName,
        p.nickName,
        p.lastName,
        p.afterparty,
        p.sleepover,
        age,
        email,
      ])
    )
  );
};

const exporter = (participants, fetchRelatedRecords) => {
  fetchRelatedRecords(participants, "race", "races").then((races) => {
    getData(participants, races).then((data) => {
      const csv = convertToCSV({
        data,
        fields: [
          "Strana",
          "Skupina",
          "Jméno",
          "Přezdívka",
          "Příjmení",
          "Afterparty",
          "Přespání",
          "Věk",
          "E-mail",
        ],
      });
      downloadCSV(csv, "registrace");
    });
  });
};

const List = (props) => (
  <ListBase
    title="Účastníci"
    filters={<ParticipantFilter />}
    exporter={exporter}
    {...props}
  >
    <Datagrid>
      <FunctionField
        label="Jméno"
        render={(r) =>
          r.firstName + (r.nickname ? ` "${r.nickName}" ` : " ") + r.lastName
        }
      />
      <ReferenceField label="Událost" source="event" reference="events">
        <TextField source="name" />
      </ReferenceField>
      <TextField label="Skupina" source="group" />
      <ReferenceField label="Strana" source="race" reference="races">
        <FunctionField render={(r) => truncate(r.name, { length: 20 })} />
      </ReferenceField>
      <BooleanField label="Poznámka" source="note" />
      <BooleanField label="Afterparty" source="afterparty" />
      <BooleanField label="Přespání" source="sleepover" />
      <LocaleDateField label="Vytvořeno" source="createdate" />
      <LocaleDateField label="Aktualizováno" source="lastupdate" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </ListBase>
);

export default List;
