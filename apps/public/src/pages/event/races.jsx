import React from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import { Grid, Container } from "@material-ui/core";

import { SmallArticleCard, Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const Races = () => {
  const [event] = useEvent();
  useFirestoreConnect(() => [
    {
      collection: "races",
      where: ["event", "==", event.id],
      storeAs: `${event.id}_races`,
      orderBy: "priority",
    },
  ]);

  const races = useSelector(
    ({ firestore }) => firestore.ordered[`${event.id}_races`]
  );

  if (!isLoaded(races)) {
    return null;
  }

  const raceCards = races.map((r) => (
    <Grid item xs={12} sm={6} key={r.id}>
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
      <Container maxWidth="lg">
        {!isEmpty(races) && (
          <Grid container direction="row" spacing={2}>
            {raceCards}
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Races;
