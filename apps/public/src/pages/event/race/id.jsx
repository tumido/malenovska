import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";

import {
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Divider,
  Hidden,
} from "@material-ui/core";

import {
  Article,
  ArticleCardHeader,
  Markdown,
  ShareDialog,
  ColorBadge,
} from "../../../components";
import { ShareOutlined } from "@material-ui/icons";
import { Helmet } from "react-helmet";
import { useEvent } from "../../../contexts/EventContext";
import { useTopBanner } from "../../../contexts/TopBannerContext";

const Race = ({
  match: {
    params: { id },
  },
}) => {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [event] = useEvent();
  const { setBreadcrumbs } = useTopBanner();

  useFirestoreConnect(() => [
    {
      collection: "races",
      doc: id,
      storeAs: id,
    },
  ]);
  const race = useSelector(({ firestore }) => firestore.ordered[id]);

  useEffect(() => {
    setBreadcrumbs(
      race
        ? [{ to: `/${event.id}/races`, name: "Strany" }, { name: race[0].name }]
        : []
    );
    return () => setBreadcrumbs([]);
  }, [race]);

  if (!isLoaded(race)) {
    return <Article />;
  }

  if (!race.length || race[0].event !== event.id) {
    return <Redirect to="/not-found" />;
  }

  return (
    <Article>
      <Helmet
        title={race[0].name}
        meta={[
          {
            property: "og:image",
            content: race[0].image && race[0].image.src,
          },
        ]}
      />
      <ArticleCardHeader
        image={race[0].image && race[0].image.src}
        title={<React.Fragment>{race[0].name}</React.Fragment>}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Charakteristika strany
        </Typography>
        <Markdown content={race[0].requirements} />
        <Typography variant="body1" gutterBottom>
          Kostým pro každou stranu je laděn do jiných barevných odstínů pro
          snadnější orientaci v boji.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Barva této strany je:
          <ColorBadge
            variant="fab"
            colorName={race[0].colorName}
            color={race[0].color}
          />
        </Typography>
        <Box marginY={2}>
          <Divider variant="middle" />
        </Box>
        <Typography variant="h5" gutterBottom>
          Příběh
        </Typography>
        <Markdown content={race[0].legend} />
      </CardContent>
      <CardActions>
        <IconButton aria-label="share" onClick={() => setShareDialogOpen(true)}>
          <ShareOutlined />
        </IconButton>
      </CardActions>
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        title={race[0].name}
        eventName={event.name}
      />
    </Article>
  );
};

Race.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Race;
