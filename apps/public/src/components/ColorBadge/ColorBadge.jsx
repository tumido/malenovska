import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: ({ color }) => ({
    backgroundColor: color,
    border: `4px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
    width: 64,
    height: 64
  })
}));

const ColorBadge = ({ color, className }) => {
  const classes = useStyles({ color });

  return color ? <div className={ clsx(className, classes.root) } /> : null;
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

export default ColorBadge;
