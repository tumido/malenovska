import React from "react";
import PropTypes from "prop-types";
import { Field as FormField, FormSpy } from "react-final-form";

import {
  TextField,
  Typography,
  Grid,
  Icon,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import {
  TextFormField,
  ColorBadge,
  CheckboxFormField,
  Markdown,
} from "../../../components";
import validate from "./validators";
import { useEvent } from "../../../contexts/EventContext";

const Field = ({ type, align, props, size, raw, content }) => {
  const children =
    type === "raw" ? (
      raw
    ) : type === "markdown" ? (
      <Markdown content={content} />
    ) : (
      <FormField
        {...props}
        validate={props.validate && validate(props.validate)}
        name={props.id}
        component={
          type === "text"
            ? TextFormField
            : type === "number"
            ? TextFormField
            : type === "checkbox"
            ? CheckboxFormField
            : null
        }
      />
    );

  return (
    <Grid item xs={12} sm={size}>
      {align ? (
        <Grid container alignItems={align} justifyContent={align}>
          <Grid item>{children}</Grid>
        </Grid>
      ) : (
        children
      )}
    </Grid>
  );
};

const formFields = (races, extras = []) => [
  {
    size: 4,
    type: "text",
    props: {
      id: "nickName",
      label: "Přezdívka",
      placeholder: "Mirek",
    },
  },
  {
    size: 4,
    type: "text",
    props: {
      id: "firstName",
      label: "Jméno",
      placeholder: "Mirek",
      required: true,
      validate: ["required"],
    },
  },
  {
    size: 4,
    type: "text",
    props: {
      id: "lastName",
      label: "Příjmení",
      placeholder: "Dušín",
      required: true,
      validate: ["required"],
    },
  },
  {
    type: "text",
    props: {
      id: "email",
      label: "E-mail",
      placeholder: "mirek@rychlesipy.cz",
      required: true,
      validate: ["required", "email"],
    },
  },
  {
    size: 10,
    type: "text",
    props: {
      id: "group",
      label: "Skupina",
      placeholder: "Rychlé Šípy",
    },
  },
  {
    size: 2,
    type: "number",
    props: {
      id: "age",
      label: "Věk",
      InputProps: { inputProps: { min: 10 } },
      required: true,
      validate: ["required", ["greater", [10]]],
    },
  },
  {
    type: "raw",
    raw: (
      <FormSpy subscription={{ values: true }}>
        {({ values }) => (
          <TextField
            id="race-read-only"
            label="Strana"
            defaultValue={races.filter(({ id }) => id === values.race)[0].name}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </FormSpy>
    ),
  },
  { type: "raw", raw: <Divider sx={{mt: "2em"}} /> },
  ...extras,
  { type: "raw", raw: <Divider sx={{mt: "2em"}} /> },
  {
    type: "text",
    props: {
      id: "note",
      label: "Poznámka",
      multiline: true,
      placeholder: "A můžeme s sebou vzít i Bublinu?",
    },
  },
  {
    type: "markdown",
    content:
      "Pro přijetí výše uvedených údajů je třeba tvůj souhlas. Slibujeme, že s&nbsp;tvými údaji budeme nakládat pouze pro potřeby konání akce a nebudeme je uchovávat déle, než je nezbytně nutné.",
  },
  {
    type: "checkbox",
    align: "center",
    props: {
      id: "terms",
      label: "Souhlasím",
      validate: [["required", ["Souhlas je nutný"]]],
      icon: <Icon>favorite_border</Icon>,
      checkedIcon: <Icon>favorite</Icon>,
      labelPlacement: "bottom",
    },
  },
];

const PersonalDetails = ({ races }) => {
  const [event] = useEvent();

  return (
    <React.Fragment>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          const race = races.filter(({ id }) => id === values.race)[0];
          return (
            <React.Fragment>
              <CardContent>
                <Typography gutterBottom variant="h4" component="h2">
                  Charakteristika strany
                </Typography>
                <Markdown content={race.requirements} />
                <Typography variant="body1" gutterBottom>
                  Kostým pro každou stranu je laděn do jiných barevných odstínů
                  pro snadnější orientaci v boji.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Barva této strany je:
                  <ColorBadge
                    variant="fab"
                    colorName={race.colorName}
                    color={race.color}
                  />
                </Typography>
              </CardContent>
            </React.Fragment>
          );
        }}
      </FormSpy>
      <Divider sx={{mt: "2em"}} />
      <CardContent>
        <Box paddingY={2}>
          <Typography variant="h4" component="h2">
            Osobní údaje
          </Typography>
        </Box>
        <Grid container justifyContent="center" spacing={3}>
          {formFields(races, event.registrationExtras).map((item, idx) => (
            <Field key={`${idx}_${item.props?.id}`} {...item} />
          ))}
        </Grid>
      </CardContent>
    </React.Fragment>
  );
};

PersonalDetails.propTypes = {
  races: PropTypes.array.isRequired,
};

export default PersonalDetails;
