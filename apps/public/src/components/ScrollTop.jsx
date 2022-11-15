import React from "react";
import PropTypes from "prop-types";
import { Zoom, Icon, Fab, useScrollTrigger, Tooltip, styled } from "@mui/material";

const Div = styled('div')({
  position: "fixed",
  bottom: t => t.spacing(2),
  right: t => t.spacing(2),
})

const ScrollTop = ({ anchor }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const curAnchor = (event.target.ownerDocument || document).querySelector(
      anchor
    );

    if (curAnchor) {
      curAnchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <Div onClick={handleClick} role="presentation">
        <Tooltip
          title="Na začátek stránky"
          aria-label="Scroll back to top"
          placement="left"
        >
          <Fab color="secondary" size="medium">
            <Icon>keyboard_arrow_up</Icon>
          </Fab>
        </Tooltip>
      </Div>
    </Zoom>
  );
};

ScrollTop.propTypes = {
  anchor: PropTypes.string,
};

export default ScrollTop;
