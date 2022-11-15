import React from "react";
import PropTypes from "prop-types";

import { Grid } from "@mui/material";

import { SmallArticleCard, Markdown, Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";
import { collection, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Legends = () => {
  const [event] = useEvent();

  const [legends, loading, error] = useCollectionData(query(collection(getFirestore(), 'legends'), where("event", "==", event.id)), orderBy('publishedAt'));

  const legendsList = (!loading && !error) ? (
    legends.map((l) => (
      <Grid item container sx={{ width: { xs: "100%", md: "50%", xl: "650px" }}} key={l.id}>
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
      <Grid item container sx={{ width: { xs: "100%", md: "50%", xl: "650px" }}}>
        <SmallArticleCard />
      </Grid>
      <Grid item container sx={{ width: { xs: "100%", md: "50%", xl: "650px" }}}>
        <SmallArticleCard />
      </Grid>
      <Grid item container sx={{ width: { xs: "100%", md: "50%", xl: "650px" }}}>
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
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="stretch"
      >
        {legendsList}
      </Grid>
    </React.Fragment>
  );
};

Legends.propTypes = {
  legends: PropTypes.array,
};

export default Legends;
