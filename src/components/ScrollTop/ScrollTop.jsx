import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Zoom, Icon, Fab, useScrollTrigger, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const ScrollTop = ({ anchor }) => {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = event => {
    const curAnchor = (event.target.ownerDocument || document).querySelector(anchor);

    if (curAnchor) {
      curAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={ trigger }>
      <div onClick={ handleClick } role="presentation" className={ classes.root }>
        <Tooltip title="Na začátek stránky"  aria-label="Scroll back to top" placement='left'>
          <Fab color="secondary" size="medium">
            <Icon>keyboard_arrow_up</Icon>
          </Fab>
        </Tooltip>
      </div>
    </Zoom>
  );
};

ScrollTop.propTypes = {
  anchor: PropTypes.string
};

export default ScrollTop;
