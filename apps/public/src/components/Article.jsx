import React from "react";
import PropTypes from "prop-types";

import { Container, Card, CardContent, Box } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { ScrollTop, ArticleCardHeader } from ".";


const Article = ({ scrollTop = true, children, isLoading = false }) => {
  return (
    <Container maxWidth="lg" sx={(theme) => ({ [theme.breakpoints.down("sm")]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
    })}>
      <Box width="100%">
        <Card>
          {children && !isLoading ? (
            children
          ) : (
            <React.Fragment>
              <ArticleCardHeader />
              <CardContent>
                <Skeleton variant="text" />
              </CardContent>
            </React.Fragment>
          )}
        </Card>
      </Box>
      {scrollTop && <ScrollTop anchor="#top" />}
    </Container>
  );
};

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node,
};

export default Article;
