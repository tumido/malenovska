import React from 'react';
import PropTypes from 'prop-types';

import { TableHead, TableRow, TableCell, TableSortLabel } from '@material-ui/core';

const EnhancedTableHead = ({ classes, order, orderBy, onRequestSort, headers }) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
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
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired
};

export default EnhancedTableHead;
