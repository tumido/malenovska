import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Box,
  Card as MuiCard,
  CardContent,
  Typography,
  Divider,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  card: {
    minHeight: 52,

    "& a": {
      textDecoration: "none",
      color: "inherit",
    },
  },
  main: {
    overflow: "inherit",
    padding: 16,
  },
}));

const Card = ({ label, value, to, children }) => {
  const classes = useStyles();

  const cardContent = (
    <CardContent className={classes.main}>
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
    <MuiCard className={classes.card}>
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
