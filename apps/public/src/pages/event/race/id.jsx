import React, { useEffect, lazy } from "react";
import { useParams } from "react-router-dom";

import {
  CardContent,
  CardActions,
  Typography,
  Box,
  Divider,
  Container,
  Button,
} from "@mui/material";

import {
  Article,
  ArticleCardHeader,
  Markdown,
  ShareDialog,
  ColorBadge,
} from "../../../components";
import { ShareOutlined } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useEvent } from "../../../contexts/EventContext";
import { useTopBanner } from "../../../contexts/TopBannerContext";

const NotFound = lazy(() => import("../../404"));

const Race = () => {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [event] = useEvent();
  const { setBreadcrumbs } = useTopBanner();
  const { id } = useParams();

  const [race, loading, error] = useDocumentData(doc(getFirestore(), 'races', id));

  useEffect(() => {
    setBreadcrumbs(
      race
        ? [{ to: `/${event.id}/races`, name: "Strany" }, { name: race.name }]
        : []
    );
    return () => setBreadcrumbs([]);
  }, [race, loading, error]);

  if (loading || error) {
    return <Article />;
  }

  if (race.event !== event.id) {
    return <NotFound />;
  }

  return (
    <Article>
      <Helmet
        title={race.name}
        meta={[
          {
            property: "og:image",
            content: race.image && race.image.src,
          },
        ]}
      />
      <ArticleCardHeader
        image={race.image && race.image.src}
        title={<React.Fragment>{race.name}</React.Fragment>}
      />
      <CardContent>
        <Container maxWidth="md" sx={{my: 4}}>
          <Typography variant="h5" gutterBottom>
            Charakteristika strany
          </Typography>
          <Markdown content={race.requirements} />
          <Typography variant="body1" gutterBottom>
            Kostým pro každou stranu je laděn do jiných barevných odstínů pro
            snadnější orientaci v boji.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Barva této strany je:
            <ColorBadge
              variant="fab"
              colorName={race.colorName}
              color={race.color}
              />
          </Typography>
        </Container>
          <Divider variant="middle" />
        <Container maxWidth="md" sx={{my: 4}}>
          <Typography variant="h5" gutterBottom>
            Příběh
          </Typography>
          <Markdown content={race.legend} />
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
        title={race.name}
        eventName={event.name}
      />
    </Article>
  );
};

export default Race;
