import React from "react";
import PropTypes from "prop-types";
import { Icon, InputBase, inputBaseClasses } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/system";


const Search = styled('div')(({theme}) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}))

const SearchIcon = styled('div')(({theme}) => ({
  width: theme.spacing(7),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const TableSearch = ({ onSearch = () => null }) => {
  const [value, setValue] = React.useState("");

  const handleEscKeyPress = (event) => {
    if (event.key === "Escape") {
      setValue("");
    }
  };

  React.useEffect(() => onSearch(value), [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Search>
      <SearchIcon>
        <Icon>search</Icon>
      </SearchIcon>
      <InputBase
        placeholder="Hledat…"
        sx={{ color: "inherit" }}
        inputProps={{
          "aria-label": "search",
          sx: {
            pl: 7,
            transition: t => t.transitions.create("width"),
            width: { xs: "100%", md: "100px" },
            "&:focus": {
              width: { md: "170px"},
            }
          }
        }}
        onChange={handleChange}
        onKeyDown={handleEscKeyPress}
        value={value}
      />
    </Search>
  );
};

TableSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default TableSearch;
