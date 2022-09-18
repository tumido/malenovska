import React from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import PropTypes from "prop-types";

import { Grid, Container } from "@mui/material";

import { SmallArticleCard, Markdown, Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const Legends = () => {
  const [event] = useEvent();
  useFirestoreConnect(() => [
    {
      collection: "legends",
      where: ["event", "==", event.id],
      storeAs: `legends_${event.id}`,
      orderBy: "publishedAt",
    },
  ]);
  const legends = useSelector(
    ({ firestore }) => firestore.ordered[`legends_${event.id}`]
  );

  const legendsList = isLoaded(legends) ? (
    legends.map((l) => (
      <Grid item container xs={12} sm={6} lg={4} key={l.id}>
        <SmallArticleCard
          title={l.title}
          body={l.perex}
          image={l.image}
          href={`/${event.id}/legend/${l.id}`}
        />
      </Grid>
    ))
  ) : (
    <React.Fragment>
      <Grid item container xs={12} sm={6} lg={4}>
        <SmallArticleCard />
      </Grid>
      <Grid item container xs={12} sm={6} lg={4}>
        <SmallArticleCard />
      </Grid>
      <Grid item container xs={12} sm={6} lg={4}>
        <SmallArticleCard />
      </Grid>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Helmet title="Legendy" />
      <Banner title="Legendy">
        <Markdown content={event.description} />
      </Banner>
      <Container maxWidth="lg">
        {!isEmpty(legendsList) && (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
          >
            {legendsList}
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
};

Legends.propTypes = {
  legends: PropTypes.array,
};

export default Legends;
