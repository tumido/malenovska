import React, { lazy, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import {
  isLoaded,
  useFirestoreConnect,
  useFirestore,
} from "react-redux-firebase";
import { useSnackbar } from "notistack";

import { Grid, Hidden, Container, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import {
  Article,
  Banner,
  Loading,
  Wizard,
  NotificationAction,
} from "../../components";
const PersonalDetails = lazy(() => import("./signup_steps/PersonalDetails"));
const Readout = lazy(() => import("./signup_steps/Readout"));
const RaceSelect = lazy(() => import("./signup_steps/RaceSelect"));
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";
import { getRaceById, participantsForRace } from "../../utilities/filters";

const useStyles = makeStyles((theme) => ({
  stepper: {
    background: "transparent",
  },
  buttons: {
    margin: 20,
    "& > *": {
      margin: 20,
    },
  },
  buttonWrapper: {
    alignSelf: "center",
  },
  success: {
    color: theme.palette.success.main,
    fontSize: 100,
  },
  error: {
    color: theme.palette.error.main,
    fontSize: 100,
  },
}));

const registerNewParticipant = async (
  data,
  participants,
  races,
  firestore,
  enqueueSnackbar,
  closeSnackbar
) => {
  const personDataPrivate = { age: data.age, email: data.email };
  delete data.email;
  delete data.age;
  const personDataPublic = {
    ...data,
    createdate: new Date(),
  };
  const pk = `${data.event}:${data.firstName}-${data.nickName || ""}-${
    data.lastName
  }`;

  enqueueSnackbar(`Registruji: ${data.firstName} ${data.lastName}`, {
    key: `${pk}__pending`,
    action: (
      <NotificationAction
        action="spinner"
        onClose={() => closeSnackbar(`${pk}__pending`)}
      />
    ),
    persist: true,
  });

  const race = getRaceById(races, data.race);
  if (participantsForRace(participants, race) >= race.limit) {
    closeSnackbar(`${pk}__pending`);
    enqueueSnackbar("Někdo tě předběhl, limit pro stranu dosažen.", {
      key: `${pk}__result`,
      action: (
        <NotificationAction
          action="close"
          onClose={() => closeSnackbar(`${pk}__result`)}
        />
      ),
      variant: "error",
      persist: true,
    });
    return {
      message: "Někdo tě předběhl, limit pro stranu dosažen.",
      options: { variant: "error" },
    };
  }

  const batch = firestore.batch();
  const personDoc = firestore.collection("participants").doc(pk);

  batch.set(personDoc, personDataPublic);
  batch.set(personDoc.collection("private").doc("_"), personDataPrivate);

  const result = await (async () => {
    try {
      await batch.commit();
      return {
        message: "Registrace proběhla úspěšně",
        options: {
          variant: "success",
        },
      };
    } catch ({ code }) {
      return {
        message:
          code === "permission-denied"
            ? "Tento účastík je již registrován"
            : "Něco se nepovedlo, kontaktujte nás prosím",
        options: {
          variant: "error",
          persist: true,
        },
      };
    }
  })();

  closeSnackbar(`${pk}__pending`);
  enqueueSnackbar(result.message, {
    key: `${pk}__result`,
    action: (
      <NotificationAction
        action="close"
        onClose={() => closeSnackbar(`${pk}__result`)}
      />
    ),
    ...result.options,
  });

  return result;
};

const New = () => {
  const classes = useStyles();
  const [event] = useEvent();
  const firestore = useFirestore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useFirestoreConnect(() => [
    {
      collection: "races",
      where: ["event", "==", event.id],
      storeAs: `${event.id}_races`,
      orderBy: "priority",
    },
    {
      collection: "participants",
      where: ["event", "==", event.id],
      storeAs: `${event.id}_participants`,
    },
  ]);

  const races = useSelector(
    ({ firestore }) => firestore.ordered[`${event.id}_races`]
  );
  const participants = useSelector(
    ({ firestore }) => firestore.ordered[`${event.id}_participants`]
  );

  const [stepperEl, setStepperEl] = React.useState(null);
  const handleStepperRef = React.useCallback(
    (instance) => setStepperEl(instance),
    [setStepperEl]
  );

  const [buttonsEl, setButtonsEl] = React.useState(null);
  const handleButtonsRef = React.useCallback(
    (instance) => setButtonsEl(instance),
    [setButtonsEl]
  );

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitted(data);
    setResult(
      await registerNewParticipant(
        { event: event.id, ...data },
        participants,
        races,
        firestore,
        enqueueSnackbar,
        closeSnackbar
      )
    );
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(false);
  };

  const isLoading = !isLoaded(races) || !isLoaded(participants);

  if (!event.registrationAvailable) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Route available only because you're in devel mode.");
    } else {
      return <Redirect to="/not-found" />;
    }
  }

  return (
    <React.Fragment>
      <Helmet title="Nová registrace" />
      <Banner title="Registrace" />
      {!submitted ? (
        <Article scrollTop={false}>
          <Grid container direction="column" wrap="nowrap" spacing={2}>
            <Hidden smDown>
              <Grid item ref={handleStepperRef} />
            </Hidden>
            <Grid item>
              <Wizard
                isLoading={isLoading}
                onSubmit={handleSubmit}
                subscription={{ submitting: true, pristine: true }}
                stepperProps={{
                  className: classes.stepper,
                  names: ["Výběr strany", "Legenda", "Osobní údaje"],
                }}
                buttonsProps={{
                  className: classes.buttons,
                }}
                portals={{
                  stepper: stepperEl,
                  buttons: buttonsEl,
                }}
              >
                <Wizard.Page>
                  {!isLoading && (
                    <RaceSelect
                      texts={{
                        above: event.registrationBeforeAbove,
                        below: event.registrationBeforeBelow,
                      }}
                      races={races}
                      participants={participants}
                    />
                  )}
                </Wizard.Page>
                <Wizard.Page>
                  {!isLoading && (
                    <Readout races={races} participants={participants} />
                  )}
                </Wizard.Page>
                <Wizard.Page>
                  {!isLoading && <PersonalDetails races={races} />}
                </Wizard.Page>
              </Wizard>
            </Grid>
            <Grid
              item
              className={classes.buttonWrapper}
              ref={handleButtonsRef}
            />
          </Grid>
        </Article>
      ) : (
        <>
          {!result ? (
            <Loading isFloating />
          ) : result.options.variant === "success" ? (
            <Grid container justifyContent="center">
              <CheckCircleOutlineIcon className={classes.success} />
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <ErrorOutlineIcon className={classes.error} />
            </Grid>
          )}
          <Grid
            container
            justifyContent="center"
            spacing={2}
            style={{ margin: "20px -20px" }}
          >
            {result && (
              <Grid item>
                <Button variant="contained" size="large" onClick={handleReset}>
                  Nová registrace
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button variant="contained" size="large" href="attendees">
                Zobrazit přihlášené účastníky
              </Button>
            </Grid>
            {parseInt(submitted.age, 10) < 18 && (
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  target="_blank"
                  href={event.declaration && event.declaration.src}
                >
                  Potvrzení pro nezletilé
                </Button>
              </Grid>
            )}
          </Grid>
          <Container maxWidth="md">
            <Grid container direction="column" spacing={2}>
              {parseInt(submitted.age, 10) < 18 && (
                <Grid item>
                  <Alert severity="warning">
                    Ještě ti nebylo 18 let a my nechceme být zodpovědní za žádná
                    tvá zranění. Nezapomeň si stáhnout, vyplnit a hlavně přinést
                    podepsané potvrzení pro nezletilé.
                  </Alert>
                </Grid>
              )}
              {result?.options?.variant === "error" && (
                <Grid item>
                  <Alert severity="error">
                    Registrace nebyla provedena: {result.message}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Container>
        </>
      )}
    </React.Fragment>
  );
};

New.propTypes = {
  registerNewParticipant: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default New;
