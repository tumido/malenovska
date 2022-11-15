import React from "react";
import { Grid, Container } from "@mui/material";
import { SmallArticleCard, Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Races = () => {
  const [event] = useEvent();

  const [races, loading, error] = useCollectionData(
    query(collection(getFirestore(), "races"), where("event", "==", event.id)),
    orderBy("priority")
  );

  if (loading) {
    return null;
  }

  const raceCards = races.map((r) => (
    <Grid item sx={{ width: { xs: "100%", md: "50%", xl: "650px" }}} key={r.id}>
      <SmallArticleCard
        title={r.name}
        image={r.image}
        href={`/${event.id}/race/${r.id}`}
      />
    </Grid>
  ));

  return (
    <React.Fragment>
      <Helmet title="Bojující strany" />
      <Banner title="Strany" />
      <Grid container direction="row" justifyContent="center" spacing={2}>
        {raceCards}
      </Grid>
    </React.Fragment>
  );
};

export default Races;
