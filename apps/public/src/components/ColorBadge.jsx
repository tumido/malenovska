import React from "react";
import PropTypes from "prop-types";

import { Typography, Paper } from "@mui/material";


const ColorBadge = ({ color, colorName }) => {
  if (!color) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{
      background: color,
      "&:hover": {
        background: color,
      },
      height: "1.8em",
      padding: ".3em .8em",
      display: "inline-block",
      marginBottom: "-.2em",
      marginLeft: ".5em",
    }}>
      <Typography variant="body1" sx={{
        "&:first-letter": {
          textTransform: "capitalize",
        },
        color: "transparent",
        filter: "invert(1) grayscale(1) contrast(9)",
        background: "inherit",
        backgroundClip: "text",
      }}>
        {colorName}
      </Typography>
    </Paper>
  );
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(["line", "fab"]),
  placement: PropTypes.string,
};

export default ColorBadge;
