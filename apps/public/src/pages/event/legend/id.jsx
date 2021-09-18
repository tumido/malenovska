import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";

import {
  Chip,
  Box,
  CardContent,
  IconButton,
  CardActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ShareOutlined } from "@material-ui/icons";

import {
  Markdown,
  Article,
  ArticleCardHeader,
  ShareDialog,
} from "../../../components";
import { timestampToDateStr } from "../../../utilities/firebase";
import { Helmet } from "react-helmet";
import { useEvent } from "../../../contexts/EventContext";
import { useTopBanner } from "../../../contexts/TopBannerContext";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const Legend = ({
  match: {
    params: { id },
  },
}) => {
  const classes = useStyles();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [event] = useEvent();
  const { setBreadcrumbs } = useTopBanner();

  useFirestoreConnect(() => [
    {
      collection: "legends",
      doc: id,
      storeAs: id,
    },
  ]);
  const legend = useSelector(({ firestore }) => firestore.ordered[id]);

  useEffect(() => {
    setBreadcrumbs(
      legend
        ? [
            { to: `/${event.id}/legends`, name: "Legendy" },
            { name: legend[0].title },
          ]
        : []
    );
    return () => setBreadcrumbs([]);
  }, [legend]);

  if (!isLoaded(legend)) {
    return <Article />;
  }

  if (!legend.length || legend[0].event !== event.id) {
    return <Redirect to="/not-found" />;
  }

  return (
    <Article>
      <Helmet
        title={legend[0].title}
        meta={[
          {
            property: "og:image",
            content: legend[0].image && legend[0].image.src,
          },
          { property: "og:description", content: legend[0].perex },
        ]}
      />
      <ArticleCardHeader
        title={legend[0].title}
        image={legend[0].image && legend[0].image.src}
      />
      <CardContent>
        <Chip
          label={event.name}
          variant="outlined"
          className={classes.margin}
          to={`/${event.id}`}
          component={Link}
          clickable
        />
        {legend[0].publishedAt && (
          <Chip
            label={timestampToDateStr(legend[0].publishedAt)}
            variant="outlined"
            className={classes.margin}
          />
        )}
        <Box className={classes.margin}>
          <Markdown content={legend[0].content} />
        </Box>
      </CardContent>
      <CardActions>
        <IconButton aria-label="share" onClick={() => setShareDialogOpen(true)}>
          <ShareOutlined />
        </IconButton>
      </CardActions>
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        title={legend[0].title}
        eventName={event.name}
      />
    </Article>
  );
};

Legend.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Legend;
