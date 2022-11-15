import React from "react";
import PropTypes from "prop-types";

import { Grid, Chip, Box } from "@mui/material";

import SmallArticleCard from "./SmallArticleCard";
import { participantsForRace } from "../utilities/filters";

const CardFormField = ({ input, race, participants }) => {
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
              sx={{float: 'right', backgroundColor: t => t.palette.background.paper}}
            />
          </React.Fragment>
        }
        image={race.image}
        actionAreaProps={{
          onClick: () => input.onChange(race.id),
          disabled: registeredToRace >= race.limit,
          sx: {
            border: input.value === race.id ? (t => `2px solid ${t.palette.secondary.main}`) : "2px solid transparent",
          }
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
