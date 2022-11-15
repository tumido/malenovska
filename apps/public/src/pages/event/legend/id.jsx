import React, { lazy, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Chip,
  Box,
  CardContent,
  Button,
  CardActions,
  Container,
} from "@mui/material";
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
import { doc, getFirestore } from "firebase/firestore";

const NotFound = lazy(() => import("../../404"));


const Legend = () => {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [event] = useEvent();
  const { setBreadcrumbs } = useTopBanner();
  const { id } = useParams();

  const [legend, loading, error] = useDocumentData(doc(getFirestore(), 'legends', id));

  useEffect(() => {
    setBreadcrumbs(
      legend
        ? [
            { to: `/${event.id}/legends`, name: "Legendy" },
            { name: legend.title },
          ]
        : []
    );
    return () => setBreadcrumbs([]);
  }, [legend, loading, error]);

  if (loading || error) {
    return <Article />;
  }

  if (legend.event !== event.id) {
    return <NotFound />;
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
        <Container maxWidth='md'>
          <Chip
            label={event.name}
            variant="outlined"
            sx={{m: 1}}
            to={`/${event.id}`}
            component={Link}
            clickable
          />
          {legend.publishedAt && (
            <Chip
              label={timestampToDateStr(legend.publishedAt)}
              variant="outlined"
              sx={{m: 1}}
            />
          )}
          <Box sx={{mt: 4}}>
            <Markdown content={legend.content} />
          </Box>
        </Container>
      </CardContent>
      <CardActions>
        <Button startIcon={<ShareOutlined />} aria-label="share" onClick={() => setShareDialogOpen(true)}>
          Sdílet
        </Button>
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

export default Legend;
