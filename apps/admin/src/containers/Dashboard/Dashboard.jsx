import React from "react";

import Grid from "@mui/material/Grid";
import { useGetList, useGetOne, EditButton } from "react-admin";

import { Card, PieChart } from "../../components";

const Dashboard = () => {
  const { data: config } = useGetOne("config", { id: "config" });
  const { data: event } = useGetOne("events", { id: config?.event });
  const { data: people } = useGetList("participants", {
    pagination: { page: 1, perPage: 1000 },
    filter: { event: config?.event },
  });
  const { data: races } = useGetList("races", {
    pagination: { page: 1, perPage: 1000 },
    filter: { event: config?.event },
  });

  const aggPeopleByRace = (people || []).reduce(
    (acc, p) => ({ ...acc, ...{ [p.race]: (acc[p.race] || 0) + 1 } }),
    {}
  );
  const raceDistrib = (races || []).map((r) => ({
    label: r.name,
    color: r.color,
    value: aggPeopleByRace[r.id],
  }));


  const cards = [
    {
      label: "Aktivní událost",
      to: config && `/events/${config?.event}`,
      value: event?.name,
    },
    {
      label: "Přihlášených účastníků",
      to: {
        pathname: "/participants",
        search: config
          ? `filter=${JSON.stringify({ event: config?.event })}`
          : "",
        },
      value: (people || []).length
    },
    {
      label: "Afterparty",
      value: (people || []).filter((p) => p.afterparty).length
    },
    {
      label: "Přespání",
      value: (people || []).filter((p) => p.sleepover).length
    },
    {
      label: "Jídlo",
      value: (people || []).filter((p) => p.food).length
    },
    {
      label: "Řidič",
      value: (people || []).filter((p) => p.car).length
    }
  ]

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item style={{ marginLeft: "auto" }}>
        <EditButton resource="config" label="Nastavení" record={{ id: "config" }} />
      </Grid>
      <Grid item container spacing={2}>
        {cards.map(c => (
          <Grid item lg={2} md={12} key={c.label}>
            <Card {...c} />
          </Grid>
        ))}
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
