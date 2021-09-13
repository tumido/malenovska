import React from "react";
import { connect, useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import PropTypes from "prop-types";

import { Grid, Container } from "@material-ui/core";

import { SmallArticleCard, Banner } from "components";
import { Helmet } from "react-helmet";

const List = ({ event }) => {
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
    return "";
  }

  const raceCards = races.map((r) => (
    <Grid item xs={12} sm={6} key={r.id}>
      <SmallArticleCard
        title={r.name}
        image={r.image}
        href={`/${event.id}/races/${r.id}`}
      />
    </Grid>
  ));

  return (
    <React.Fragment>
      <Helmet title="Bojující strany" />
      <Banner event={event} title="Strany" />
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

List.propTypes = {
  event: PropTypes.object.isRequired,
};

export default connect(({ event }) => ({ event }))(List);
