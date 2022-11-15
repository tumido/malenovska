import React from "react";
import { Box, Toolbar } from "@mui/material";

import TableSearch from "./TableSearch";

const TableToolbar = ({ onSearch }) =>  (
  <Toolbar sx={{ px: 1 }}>
    <Box sx={{flex: "0 0 auto"}} />
    <Box sx={{flex: "1 1 100%"}} />
    <Box>
      <TableSearch onSearch={onSearch} />
    </Box>
  </Toolbar>
);

TableToolbar.propTypes = {
  ...TableSearch.propTypes,
};

export default TableToolbar;
