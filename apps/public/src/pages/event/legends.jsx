import React from "react";
import PropTypes from "prop-types";

import { Grid, Container } from "@mui/material";

import { SmallArticleCard, Markdown, Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";
import { collection, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Legends = () => {
  const [event] = useEvent();

  const [legends, legendsLoading, legendsError] = useCollectionData(query(collection(getFirestore(), 'legends'), where("event", "==", event.id)), orderBy('publishedAt'));

  const legendsList = (!legendsLoading && !legendsError) ? (
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
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          {legendsList}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

Legends.propTypes = {
  legends: PropTypes.array,
};

export default Legends;
