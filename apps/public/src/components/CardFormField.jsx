import React from "react";
import PropTypes from "prop-types";

import { Grid, Chip, Box } from "@mui/material";
import { makeStyles } from "@mui/material/styles";

import SmallArticleCard from "./SmallArticleCard";
import { participantsForRace } from "../utilities/filters";

const useStyles = makeStyles((theme) => ({
  raised: {
    border: `2px solid ${theme.palette.secondary.main}`,
  },
  normal: {
    border: "2px solid transparent",
  },
  chip: {
    float: "right",
  },
}));

const CardFormField = ({ input, race, participants }) => {
  const classes = useStyles();
  const registeredToRace = participantsForRace(participants, race);

  return (
    <Grid item xs={12} lg={6}>
      <SmallArticleCard
        title={
          <React.Fragment>
            <Box
              display="inline-block"
              maxWidth="80%"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {race.name}
            </Box>
            <Chip
              label={`${registeredToRace} / ${race.limit}`}
              className={classes.chip}
            />
          </React.Fragment>
        }
        image={race.image}
        actionAreaProps={{
          onClick: () => input.onChange(race.id),
          disabled: registeredToRace >= race.limit,
          className: input.value === race.id ? classes.raised : classes.normal,
        }}
        cardProps={{
          elevation: input.value === race.id ? 12 : 4,
        }}
      />
    </Grid>
  );
};

CardFormField.propTypes = {
  input: PropTypes.object.isRequired,
  race: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
};

export default CardFormField;
