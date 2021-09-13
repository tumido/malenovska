import React from "react";
import PropTypes from "prop-types";
import { Field, FormSpy } from "react-final-form";

import {
  TextField,
  Typography,
  Grid,
  Icon,
  CardContent,
  Box,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextFormField, ColorBadge, CheckboxFormField } from "components";
import { required, isGreater, composeValidators, isEmail } from "./validators";
import { Markdown } from "components";

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: "2em",
  },
}));

const formFields = (races) => [
  {
    size: 4,
    field: (
      <Field
        id="nickName"
        name="nickName"
        label="Přezdívka"
        placeholder="Mirek"
        component={TextFormField}
      />
    ),
  },
  {
    size: 4,
    field: (
      <Field
        id="firstName"
        name="firstName"
        label="Jméno"
        placeholder="Mirek"
        required
        validate={required()}
        component={TextFormField}
      />
    ),
  },
  {
    size: 4,
    field: (
      <Field
        id="lastName"
        name="lastName"
        label="Příjmení"
        placeholder="Dušín"
        required
        validate={required()}
        component={TextFormField}
      />
    ),
  },
  {
    field: (
      <Field
        id="email"
        name="email"
        label="E-mail"
        placeholder="mirek@rychlesipy.cz"
        required
        validate={composeValidators(required(), isEmail)}
        component={TextFormField}
      />
    ),
  },
  {
    size: 10,
    field: (
      <Field
        id="group"
        name="group"
        label="Skupina"
        placeholder="Rychlé Šípy"
        component={TextFormField}
      />
    ),
  },
  {
    size: 2,
    field: (
      <Field
        id="age"
        name="age"
        label="Věk"
        type="number"
        InputProps={{ inputProps: { min: 10 } }}
        required
        validate={composeValidators(required(), isGreater(10))}
        component={TextFormField}
      />
    ),
  },
  {
    field: (
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
  {
    field: (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="body1">
            Jako každý rok i letos jsme se rozhodli se po bitvě sejít na
            malinovku, čaj či pivo. Hledáme proto vhodnou lokalitu. Moc nám
            pomůže, když budeme vědět, jak velký zájem máme čekat. Lorem, ipsum
            dolor sit amet consectetur adipisicing elit. Sed laudantium optio
            odio, esse assumenda maxime in deserunt iure nisi unde.
          </Typography>
        </Grid>
        <Grid item>
          <Field
            id="afterparty"
            name="afterparty"
            label="Mám zájem se zúčastnit"
            type="checkbox"
            labelPlacement="end"
            component={CheckboxFormField}
          />
        </Grid>
      </Grid>
    ),
  },
  {
    field: (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="body1">
            Pro velké odvážlivce je zde navíc ještě možnost přespat na bojišti.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
            pariatur voluptatum maiores saepe, exercitationem quis quibusdam
            cumque possimus reiciendis officia sequi! Omnis laborum autem,
            recusandae in ex at nobis odit?
          </Typography>
        </Grid>
        <Grid item>
          <Field
            id="sleepover"
            name="sleepover"
            label="Rád bych na místě přespal"
            type="checkbox"
            labelPlacement="end"
            component={CheckboxFormField}
          />
        </Grid>
      </Grid>
    ),
  },
  {
    field: (
      <Field
        id="note"
        name="note"
        label="Poznámka"
        multiline
        placeholder="A můžeme s sebou vzít i Bublinu?"
        component={TextFormField}
      />
    ),
  },
  {
    field: (
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="body1">
            Pro přijetí výše uvedených údajů je třeba tvůj souhlas. Slibujeme,
            že s&nbsp;tvými údaji budeme nakládat pouze pro potřeby konání akce
            a nebudeme je uchovávat déle, než je nezbytně nutné.
          </Typography>
        </Grid>
        <Grid item>
          <Field
            id="terms"
            name="terms"
            label="Souhlasím"
            type="checkbox"
            validate={required("Souhlas je nutný")}
            component={CheckboxFormField}
            icon={<Icon>favorite_border</Icon>}
            checkedIcon={<Icon>favorite</Icon>}
          />
        </Grid>
      </Grid>
    ),
  },
];

const PersonalDetails = ({ races }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          const race = races.filter(({ id }) => id === values.race)[0];
          return (
            <React.Fragment>
              <ColorBadge variant="line" color={race.color} />
              <CardContent>
                <Typography gutterBottom variant="h4" component="h2">
                  Charakteristika strany
                </Typography>
                <Markdown content={race.requirements} />
                <ColorBadge variant="fab" color={race.color} />
              </CardContent>
            </React.Fragment>
          );
        }}
      </FormSpy>
      <Divider className={classes.marginTop} />
      <CardContent>
        <Box paddingY={2}>
          <Typography variant="h4" component="h2">
            Osobní údaje
          </Typography>
        </Box>
        <Grid container justifyContent="center" spacing={3}>
          {formFields(races).map((item, idx) => (
            <Grid item xs={12} sm={item.size} key={idx}>
              {item.field}
            </Grid>
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
