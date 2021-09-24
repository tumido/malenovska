import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useGetOne, useGetList, EditButton } from "react-admin";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 52,
  },
  main: {
    overflow: "inherit",
    padding: 16,
  },
}));

const DashboardCard = ({ label, value }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.main}>
        <Box textAlign="right">
          <Typography color="textSecondary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" component="h2">
            {value || <Skeleton animation="wave" />}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { data: config } = useGetOne("config", "config");
  const { data: event } = useGetOne("events", config?.event || "");
  const { data: participantsData, ids: participantIds } = useGetList(
    "participants",
    { page: 1, perPage: 1000 },
    {},
    { event: config?.event || "" }
  );

  return (
    <Grid container spacing={2}>
      <Grid item>
        <DashboardCard label="Aktivní událost" value={event?.name} />
      </Grid>
      <Grid item>
        <DashboardCard
          label="Přihlášených účastníků"
          value={(participantIds || []).length}
        />
      </Grid>
      <Grid item>
        <DashboardCard
          label="Afterparty"
          value={
            (participantIds.map((id) => participantsData[id]) || []).filter(
              (p) => p.afterparty
            ).length
          }
        />
      </Grid>
      <Grid item>
        <EditButton
          basePath="config"
          label="Nastavení"
          record={{ id: "config" }}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
