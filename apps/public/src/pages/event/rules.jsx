import React from "react";

import { CardContent, Container } from "@mui/material";

import { Article, ArticleCardHeader, Banner, Markdown } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const Rules = () => {
  const [event] = useEvent();

  return (
    <React.Fragment>
      <Helmet title="Pravidla" />
      <Banner title="Pravidla" />
      <Article>
        <ArticleCardHeader
          image={event.rulesImage && event.rulesImage.src}
        />
        <CardContent>
          <Container maxWidth='md' sx={{mt: 4}}>
            <Markdown content={event.rules} />
          </Container>
        </CardContent>
      </Article>
    </React.Fragment>
  );
};

export default Rules;
