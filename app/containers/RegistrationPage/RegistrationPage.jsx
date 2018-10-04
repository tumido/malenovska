import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { change as changeFormFieldValue, formValueSelector } from 'redux-form';
import pick from 'lodash/pick';

import RegistrationForm from 'components/RegistrationForm';
import LoadingIndicator from 'components/LoadingIndicator';
import RaceDescription from 'components/RaceDescription';
import List from 'components/List';
import RaceItem from 'components/RaceItem';

import './style.scss';

const addParticipant = (firestore, values, counts, limit) => {
  let publicData = pick(values, ['nickname', 'firstName', 'lastName', 'group', 'race', 'raceRef']);
  let privateData = pick(values, ['age', 'email']);

  if (counts[values.raceRef.id].length >= limit) {
    alert("Tady uže je plno!");
    return;
  }

  var batch = firestore.batch();
  let participant = firestore.collection('participants').doc(`${values.firstName}-${values.lastName}-(${values.nickname})`);
  let participantPrivate = participant.collection('private').doc();
  batch.set(participant, publicData);
  batch.set(participantPrivate, privateData);

  batch.commit().then(result => {
    alert(`${values.race} tě přijímají do svých řad.\n\nSpolehlivě upsáno! 🍺`)
  })
  .catch(err => {(
    err.code == "permission-denied"
      ? alert("Tento účastík je již nejspíše registrován. Pokud jste však přesvědčeni o své pravdě, křičte!")
      : alert("Něco se nepovedlo. Dejte nám vědět, prosím...")
  )})
}


const RegistrationPage = ({ races, firestore, participants, selectedRace, changeRace }) => {
  const submit = values => {
    let race = races.filter(r => r.name == values.race)[0];
    values.raceRef = firestore.doc(`races/${race.id}`)
    addParticipant(firestore, values, participantsToRaceMap, race.limit);
  }

  const participantsToRaceMap = !isLoaded(races) || !isLoaded(participants)
  ? {}
  : races.reduce((obj, race) => {
      obj[race.id] = Object.values(participants).filter(p => p && p.raceRef && p.raceRef.id == race.id)
      return obj;
    }, {});

  const racesNamesList = !isLoaded(races) || isEmpty(races)
      ? []
      : Object.keys(races).map(
        (key) => (
          <RaceItem
            className={"custom-font " + (races[key].name === selectedRace ? "selectedRace" : "")}
            key={`race-${key}`}
            onClick={() => changeRace(races[key].name)}
            name={races[key].name}
            count={participantsToRaceMap && participantsToRaceMap[races[key].id] ? participantsToRaceMap[races[key].id].length : 0}
            limit={races[key].limit}
          />
        )
      )

  let localSelectedRace = isLoaded(races) && !isEmpty(races) ? races.filter(r => r.name == selectedRace)[0] : undefined

  return !isLoaded(races) || !isLoaded(participants) ? <LoadingIndicator /> :
    (
      <div className="RegistrationPage">
        <List component='section' items={racesNamesList} />
        <RaceDescription component='section' race={localSelectedRace} />
        <section className="regForm">
          <RegistrationForm onSubmit={submit} />
        </section>
      </div>
    )
}

const mapStateToProps = (state) => ({
  races: state.firestore.ordered.races,
  participants: state.firestore.data.participants,
  selectedRace: formValueSelector('registration')(state, 'race'),
});

const mapDispatchToProps = (dispatch) => ({
  changeRace: (value) => {
    dispatch(changeFormFieldValue('registration', 'race', value))
  }
});

export default compose(
  firestoreConnect([
    {
      collection: 'races',
      // where: [
      //   ['current', '==', true]
      // ],
      orderBy: 'priority'
    },
    {
      collection: 'participants'
    }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(RegistrationPage);
