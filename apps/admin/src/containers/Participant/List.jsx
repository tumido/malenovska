import React from "react";
import {
  List as ListBase,
  Datagrid,
  Filter,
  ReferenceInput,
  SelectInput,
  SearchInput,
  TextField,
  ReferenceField,
  FunctionField,
  BooleanField,
  EditButton,
  ShowButton,
  downloadCSV,
  useListContext,
} from "react-admin";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import { truncate } from "lodash/string";

import { getPrivateSubDocument } from "./shared";
import { LocaleDateField } from "../../components/LocaleDateField";

const ParticipantFilter = (props) => {
  const {filterValues} = useListContext()
  return (
    <Filter {...props}>
      <ReferenceInput source="event" reference="events" label="Událost" alwaysOn>
        <SelectInput source="name" label="Událost" optionText="name" />
      </ReferenceInput>
      <ReferenceInput
        source="race"
        reference="races"
        label="Strana"
        filter={{ event: filterValues.event }}
        alwaysOn
      >
        <SelectInput source="name" optionText="name" label="Strana"/>
      </ReferenceInput>
      <SearchInput source="nickName" alwaysOn sx={{ "& > div": { mb: "4px" }}}/>
    </Filter>
  );
};

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
    perPage={25}
  >
    <Datagrid>
      <FunctionField
        label="Jméno"
        render={(r) => `${r.firstName} ${r.lastName}`}
      />
      <TextField label="Přezdívka" source="nickName" />
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
