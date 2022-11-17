import React, { lazy, useState } from "react";
import { collection, doc, getFirestore, writeBatch, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";

import { Grid, Hidden, Container, Button } from "@mui/material";
import { Alert } from "@mui/lab";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {
  Article,
  Banner,
  Loading,
  Wizard,
  NotificationAction,
} from "../../components";
import { useEvent } from "../../contexts/EventContext";
import { getRaceById, participantsForRace } from "../../utilities/filters";

const PersonalDetails = lazy(() => import("./signup_steps/PersonalDetails"));
const Readout = lazy(() => import("./signup_steps/Readout"));
const RaceSelect = lazy(() => import("./signup_steps/RaceSelect"));
const NotFound = lazy(() => import("../404"));

const registerNewParticipant = async (
  data,
  participants,
  races,
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

  const firestore = getFirestore();
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "participants", pk), personDataPublic);
  batch.set(doc(firestore, "participants", pk, "private", "_"), personDataPrivate);

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
  const [event] = useEvent();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [participants, participantsLoading, participantsError] =
    useCollectionData(
      query(
        collection(getFirestore(), "participants"),
        where("event", "==", event.id)
      )
    );
  const [races, racesLoading, racesError] = useCollectionData(
    query(collection(getFirestore(), "races"), where("event", "==", event.id))
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
        enqueueSnackbar,
        closeSnackbar
      )
    );
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(false);
  };

  const isLoading = racesLoading || participantsLoading;

  if (!event.registrationAvailable && DEVELOPMENT !== true) {
      return <NotFound />;
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
                  sx: { background: "transparent", m: "20px" },
                  names: ["Výběr strany", "Legenda", "Osobní údaje"],
                }}
                buttonsProps={{
                  sx: { m: "20px", "& > *": { m: "20px" }}
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
              alignSelf="center"
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
              <CheckCircleOutlineIcon sx={{ color: t => t.palette.success.main, fontSize: "100px" }} />
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <ErrorOutlineIcon sx={{ color: t => t.palette.error.main, fontSize: "100px" }} />
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

export default New;
