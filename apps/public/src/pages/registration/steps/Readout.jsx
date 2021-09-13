import React from "react";
import PropTypes from "prop-types";
import { FormSpy } from "react-final-form";

import { Chip, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Markdown, ColorBadge, ArticleCardHeader } from "../../../components";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(1),
  },
}));

const Readout = ({ races, participants }) => {
  const classes = useStyles();

  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => {
        const race = races.filter(({ id }) => id === values.race)[0];
        const registeredToRace = participants.filter(
          (p) => p.race === values.race
        ).length;

        return (
          <React.Fragment>
            <ColorBadge variant="line" color={race.color} />
            <ArticleCardHeader
              image={race.image && race.image.src}
              title={
                <React.Fragment>
                  {race.name}
                  <Chip
                    label={`${registeredToRace} / ${race.limit}`}
                    className={classes.chip}
                  />
                  <ColorBadge variant="fab" color={race.color} />
                </React.Fragment>
              }
            />
            <CardContent>
              <Markdown content={race.legend} />
            </CardContent>
          </React.Fragment>
        );
      }}
    </FormSpy>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default Readout;
