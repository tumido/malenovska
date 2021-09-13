import React from "react";
import { connect, useSelector } from "react-redux";
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
} from "@material-ui/core";

import {
  Article,
  ArticleCardHeader,
  Markdown,
  ShareDialog,
  ColorBadge,
} from "../../components";
import { ShareOutlined } from "@material-ui/icons";
import { Helmet } from "react-helmet";

const Show = ({
  match: {
    params: { id },
  },
  event,
}) => {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  useFirestoreConnect(() => [
    {
      collection: "races",
      doc: id,
      storeAs: id,
    },
  ]);
  const race = useSelector(({ firestore }) => firestore.ordered[id]);

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
          { property: "og:image", content: race[0].image && race[0].image.src },
        ]}
      />
      <ColorBadge variant="line" color={race[0].color} />
      <ArticleCardHeader
        image={race[0].image && race[0].image.src}
        title={
          <React.Fragment>
            {race[0].name}
            <ColorBadge variant="fab" color={race[0].color} />
          </React.Fragment>
        }
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Charakteristika strany
        </Typography>
        <Markdown content={race[0].requirements} />
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

Show.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  event: PropTypes.object.isRequired,
};

export default connect(({ event }) => ({ event }))(Show);
