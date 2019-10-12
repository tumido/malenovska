import React from 'react';
import PropTypes from 'prop-types';

import { TableHead as BaseTableHead, TableRow, TableCell, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

const TableHead = ({ order, orderBy, onRequestSort, headers }) => {
  const classes = useStyles();
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <BaseTableHead>
      <TableRow>
        { headers.map((cell, idx) => (
          <TableCell
            key={ idx }
            sortDirection={ orderBy === cell.id ? order : false }
          >
            <TableSortLabel
              active={ orderBy === cell.id }
              direction={ order }
              onClick={ createSortHandler(cell.id) }
            >
              {cell.label}
              {orderBy === cell.id ? (
                <span className={ classes.visuallyHidden }>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </BaseTableHead>
  );
};

TableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired
};

export default TableHead;
