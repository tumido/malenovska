import React from "react";

import {
  Grid,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Icon,
} from "@mui/material";
import { TodayOutlined, EventOutlined, MailOutlined } from "@mui/icons-material";

import { Article, ArticleCardHeader, Banner, Markdown } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const contactButtons = (event) => [
  {
    href: (event.contact && event.contact.facebook) || "",
    startIcon: <Icon className="fab fa-facebook-f" />,
    text: "Událost na facebooku",
  },
  {
    href: (event.contact && event.contact.larpovadatabaze) || "",
    startIcon: <TodayOutlined />,
    text: "Larpová Databáze",
  },
  {
    href: (event.contact && event.contact.larpcz) || "",
    startIcon: <EventOutlined />,
    text: "LARP.cz",
  },
  {
    href: (event.contact && event.contact.email) || "",
    startIcon: <MailOutlined />,
    text: "E-mail organizátorům",
  },
];

const Contacts = () => {
  const [event] = useEvent();
  return (
    <React.Fragment>
      <Helmet title="Tým" />
      <Banner title="Kontakt a tým" />
      <Article>
        <ArticleCardHeader
          height={600}
          image={event.contactImage && event.contactImage.src}
        />
        <CardContent>
          <Markdown content={event.contactText} />
          <Box marginY={4}>
            <Divider />
          </Box>
          <Typography variant="h5" gutterBottom component="h3">
            Kontakty a odkazy pro současný ročník
          </Typography>
          <Box marginTop={4}>
            <Grid container justifyContent="center" spacing={2}>
              {contactButtons(event).map((c) => (
                <Grid item key={c.href}>
                  <Button
                    variant="outlined"
                    color="primary"
                    target="_blank"
                    href={c.href}
                    disabled={!c.href}
                    startIcon={c.startIcon}
                  >
                    {c.text}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Article>
    </React.Fragment>
  );
};

export default Contacts;
