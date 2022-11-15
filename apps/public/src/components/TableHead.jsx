import React from "react";
import PropTypes from "prop-types";

import {
  TableHead as BaseTableHead,
  TableRow,
  TableCell,
  TableSortLabel as BaseTableSortLabel, tableSortLabelClasses
} from "@mui/material";
import { styled } from "@mui/system";


const TableSortLabel = styled(BaseTableSortLabel)(({theme}) => ({
  [`&.${tableSortLabelClasses.icon}`]: {
    opacity: 0.25,
  }
}))

const PretendedHidden = styled('span')({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  top: 20,
  width: 1,
})

const TableHead = ({ order, orderBy, onRequestSort, headers }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <BaseTableHead>
      <TableRow>
        {headers.map((cell, idx) => (
          <TableCell
            key={idx}
            sortDirection={orderBy === cell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={order}
              onClick={createSortHandler(cell.id)}
            >
              {cell.label}
              {orderBy === cell.id ? (
                <PretendedHidden>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </PretendedHidden>
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
};

export default TableHead;
