import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDataProvider, EditButton } from "react-admin";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 52,
  },
  main: {
    overflow: "inherit",
    padding: 16,
  },
}));

const Dashboard = () => {
  const dataProvider = useDataProvider();
  const [config, setConfig] = useState();
  const [event, setEvent] = useState();
  const classes = useStyles();

  useEffect(async () => {
    const { data } = await dataProvider.getOne("config", { id: "config" });
    setConfig(data);
  }, []);
  useEffect(async () => {
    if (!config) {
      return;
    }
    const { data } = await dataProvider.getOne("events", { id: config.event });
    setEvent(data);
  }, [config]);

  return (
    <Grid container spacing={8}>
      <Grid item>
        <Card className={classes.card}>
          <CardContent className={classes.main}>
            <Box textAlign="right">
              <Typography color="textSecondary" gutterBottom>
                Aktivní událost
              </Typography>
              <Typography variant="h5" component="h2">
                {event?.name}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <EditButton
              basePath="config"
              label="Změnit"
              record={{ id: "config" }}
            />
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
