import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Chip,
  Box,
  CardContent,
  IconButton,
  CardActions,
} from "@mui/material";
import { makeStyles } from "@mui/material/styles";
import { ShareOutlined } from "@mui/icons-material";

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
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

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

  const [legend, legendLoading, legendError] = useDocumentData(doc('legends', id));

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
  }, [legend, legendLoading, legendError]);

  if (legendLoading || legendError) {
    return <Article />;
  }

  if (legend.event !== event.id) {
    return <Navigate to="/not-found" />;
  }

  return (
    <Article>
      <Helmet
        title={legend.title}
        meta={[
          {
            property: "og:image",
            content: legend.image && legend.image.src,
          },
          { property: "og:description", content: legend.perex },
        ]}
      />
      <ArticleCardHeader
        title={legend.title}
        image={legend.image && legend.image.src}
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
        {legend.publishedAt && (
          <Chip
            label={timestampToDateStr(legend.publishedAt)}
            variant="outlined"
            className={classes.margin}
          />
        )}
        <Box className={classes.margin}>
          <Markdown content={legend.content} />
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
        title={legend.title}
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
