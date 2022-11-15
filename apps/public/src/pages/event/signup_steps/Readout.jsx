import React from "react";
import PropTypes from "prop-types";
import { FormSpy } from "react-final-form";

import { Chip, CardContent } from "@mui/material";

import { Markdown, ColorBadge, ArticleCardHeader } from "../../../components";
import { Container } from "@mui/system";

const Readout = ({ races, participants }) => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => {
      const race = races.filter(({ id }) => id === values.race)[0];
      const registeredToRace = participants.filter(
        (p) => p.race === values.race
      ).length;

      return (
        <React.Fragment>
          <ArticleCardHeader
            image={race.image && race.image.src}
            title={
              <React.Fragment>
                {race.name}
                <Chip
                  label={`${registeredToRace} / ${race.limit}`}
                  sx={{ m: 1, backgroundColor: t => t.palette.background.paper }}
                />
              </React.Fragment>
            }
          />
          <CardContent>
            <Container maxWidth="md" sx={{my: 4}}>
              <Markdown content={race.legend} />
            </Container>
          </CardContent>
        </React.Fragment>
      );
    }}
  </FormSpy>
);

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default Readout;
