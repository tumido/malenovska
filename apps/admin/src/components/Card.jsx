import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Box,
  Card as MuiCard,
  CardContent,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";

const Card = ({ label, value, to, children }) => {
  const cardContent = (
    <CardContent sx={{ overflow: "inherit", p: 16 }}>
      <Box textAlign="right">
        <Typography color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" component="h2">
          {value || <Skeleton animation="wave" />}
        </Typography>
      </Box>
    </CardContent>
  );
  return (
    <MuiCard
      sx={{
        minHeight: 52,
        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      {to ? <Link to={to}>{cardContent}</Link> : cardContent}
      {children && <Divider />}
      {children}
    </MuiCard>
  );
};

Card.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  to: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
