import React from "react";
import PropTypes from "prop-types";
import { Box, CardMedia, Typography, Skeleton } from "@mui/material";

const ArticleCardHeader = ({ image, title, height, titleVariant = "h4" }) => {
  if (!image) {
    return (
      <Box sx={{ position: "relative" }}>
        <Skeleton height={height || 400} variant="rect" />
        {title && (
          <Typography
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              padding: 2,
              paddingTop: 3,
            }}
            variant={titleVariant}
            component="h2"
          >
            {title}
          </Typography>
        )}
      </Box>
    )
  }

  const thumbnailUrl = new URL(image)
  thumbnailUrl.pathname += (height && height < 400) ? "_650x650" : "_1200x1200"

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = image
  }

  return (
    <Box sx={{ position: "relative" }}>
      <CardMedia sx={{ height: height || 400 }} image={thumbnailUrl} component="img" onError={handleImageError}/>
      {title && (
        <Typography
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            padding: 2,
            paddingTop: 3,
          }}
          variant={titleVariant}
          component="h2"
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

ArticleCardHeader.propTypes = {
  image: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.number,
  titleVariant: PropTypes.string,
};

export default ArticleCardHeader;
