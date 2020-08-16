import React from 'react';
import PropTypes from 'prop-types';

import { Fab, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PaletteOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
  fab: ({ color }) => ({
    background: color,
    color: 'white',
    float: 'right',
    '&:hover': {
      background: color
    }
  }),
  line: ({ color }) => ({
    backgroundColor: color,
    display: 'box',
    textAlign: 'center',
    height: 16,
    width: '100%',
    color: 'white'
  })
});

const ColorBadge = ({ color, variant }) => {
  const styles = useStyles({ color });

  if (variant === 'fab') {
    return (
      <Fab className={ styles.fab } component='div' >
        <PaletteOutlined/>
      </Fab>
    );
  } else if (variant === 'line') {
    return !color ? null : (<Box className={ styles.line } />);
  }
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf('line', 'fab')
};

export default ColorBadge;
