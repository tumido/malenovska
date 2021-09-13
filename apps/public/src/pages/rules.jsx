import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CardContent } from "@material-ui/core";

import { Article, ArticleCardHeader, Banner, Markdown } from "../components";
import { Helmet } from "react-helmet";

const Rules = ({ event }) => (
  <React.Fragment>
    <Helmet title="Pravidla" />
    <Banner event={event} title="Pravidla" />
    <Article>
      <ArticleCardHeader
        title="Pravidla"
        image={event.rulesImage && event.rulesImage.src}
      />
      <CardContent>
        <Markdown content={event.rules} />
      </CardContent>
    </Article>
  </React.Fragment>
);

Rules.propTypes = {
  event: PropTypes.object.isRequired,
};

export default connect(({ event }) => ({ event }))(Rules);
