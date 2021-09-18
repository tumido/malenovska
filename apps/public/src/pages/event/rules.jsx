import React from "react";

import { CardContent } from "@material-ui/core";

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
          // title="Pravidla"
          image={event.rulesImage && event.rulesImage.src}
        />
        <CardContent>
          <Markdown content={event.rules} />
        </CardContent>
      </Article>
    </React.Fragment>
  );
};

export default Rules;
