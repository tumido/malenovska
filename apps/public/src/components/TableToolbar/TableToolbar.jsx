import React from 'react';
import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { TableSearch } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  spacer: {
    flex: '1 1 100%'
  },
  right: {
  },
  left: {
    flex: '0 0 auto'
  }
}));

const TableToolbar = ({ onSearch }) => {
  const classes = useStyles();

  return (
    <Toolbar className={ classes.root }>
      <div className={ classes.left }>
      </div>
      <div className={ classes.spacer } />
      <div className={ classes.right }>
        <TableSearch onSearch={ onSearch }/>
      </div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  ...TableSearch.propTypes,
};

export default TableToolbar;
