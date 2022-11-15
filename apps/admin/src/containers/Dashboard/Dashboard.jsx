import React from "react";

import { Grid } from "@material-ui/core";
import { useQueryWithStore, EditButton } from "react-admin";

import { Card, PieChart } from "../../components";

const useGetList = (resource, event, count = 1000) =>
  useQueryWithStore(
    {
      type: "getList",
      resource,
      payload: {
        pagination: { page: 1, perPage: count },
        sort: {},
        filter: { event },
      },
    },
    !Boolean(event) ? { enabled: Boolean(event) } : undefined
  );

const useGetOne = (resource, id) =>
  useQueryWithStore(
    {
      type: "getOne",
      resource,
      payload: { id },
    },
    !Boolean(id) ? { enabled: false } : undefined
  );

const Dashboard = () => {
  const { data: config } = useGetOne("config", "config");
  const { data: event } = useGetOne("events", config?.event);
  const { data: people } = useGetList("participants", config?.event);
  const { data: races } = useGetList("races", config?.event);

  const aggPeopleByRace = (people || []).reduce(
    (acc, p) => ({ ...acc, ...{ [p.race]: (acc[p.race] || 0) + 1 } }),
    {}
  );
  const raceDistrib = (races || []).map((r) => ({
    label: r.name,
    color: r.color,
    value: aggPeopleByRace[r.id],
  }));

  return (
    <Grid container spacing={2}>
      <Grid item container spacing={2}>
        <Grid item lg={2}>
          <Card
            label="Aktivní událost"
            to={config && `/events/${config?.event}`}
            value={event?.name}
          />
        </Grid>
        <Grid item lg={2}>
          <Card
            label="Přihlášených účastníků"
            to={{
              pathname: "/participants",
              search: config
                ? `filter=${JSON.stringify({ event: config?.event })}`
                : "",
            }}
            value={(people || []).length}
          />
        </Grid>
        <Grid item lg={2}>
          <Card
            label="Afterparty"
            value={(people || []).filter((p) => p.afterparty).length}
          />
        </Grid>
        <Grid item lg={2}>
          <Card
            label="Přespání"
            value={(people || []).filter((p) => p.sleepover).length}
          />
        </Grid>
        <Grid item style={{ marginLeft: "auto" }}>
          <EditButton basePath="config" label="" record={{ id: "config" }} />
        </Grid>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item lg={4}>
          <PieChart data={raceDistrib} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
