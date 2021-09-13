import React from "react";
import PropTypes from "prop-types";

import { Fab, Box, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { PaletteOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  fab: ({ color }) => ({
    background: color,
    color: "white",
    float: "right",
    "&:hover": {
      background: color,
    },
  }),
  line: ({ color }) => ({
    backgroundColor: color,
    display: "box",
    textAlign: "center",
    height: 16,
    width: "100%",
    color: "white",
  }),
  tooltip: {
    backgroundColor: "#111",
    maxWidth: "none",
    fontSize: "1.1em",
    fontWeight: "normal",
  },
});

const ColorBadge = ({ color, variant, placement = "left" }) => {
  const styles = useStyles({ color });

  if (!color) {
    return null;
  }

  if (variant === "fab") {
    return (
      <Tooltip
        title="Charakteristická barva pro tuto stranu"
        interactive
        classes={{ tooltip: styles.tooltip }}
        placement={placement}
        aria-label="race-color"
      >
        <Fab
          className={styles.fab}
          disableFocusRipple
          disableRipple
          component="div"
        >
          <PaletteOutlined />
        </Fab>
      </Tooltip>
    );
  } else if (variant === "line") {
    return <Box className={styles.line} />;
  }
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(["line", "fab"]),
  placement: PropTypes.string,
};

export default ColorBadge;
