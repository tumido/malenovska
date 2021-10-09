import React from "react";
import PropTypes from "prop-types";

import { Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chip: ({ color }) => ({
    background: color,
    "&:hover": {
      background: color,
    },
    height: "1.8em",
    padding: ".3em .8em",
    display: "inline-block",
    marginBottom: "-.2em",
    marginLeft: ".5em",
  }),
  text: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
    color: "transparent",
    filter: "invert(1) grayscale(1) contrast(9)",
    backgroundClip: "text",
    "-webkit-background-clip": "text",
    background: "inherit",
  },
  icon: {
    height: "1.5em",
    width: "1.5em",
    color: "white",
  },
  line: ({ color }) => ({
    backgroundColor: color,
    display: "box",
    textAlign: "center",
    height: 16,
    width: "100%",
    color: "white",
  }),
});

const ColorBadge = ({ color, colorName }) => {
  const styles = useStyles({ color });

  if (!color) {
    return null;
  }

  return (
    <Paper elevation={3} className={styles.chip}>
      <Typography className={styles.text} variant="body1">
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
