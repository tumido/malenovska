import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { change as changeFormFieldValue, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';

import RegistrationForm from 'components/RegistrationForm';
import LoadingIndicator from 'components/LoadingIndicator';
import RaceDescription from 'components/RaceDescription';
import List from 'components/List';
import RaceItem from 'components/RaceItem';
import NotFoundPage from 'containers/NotFoundPage'
import get from 'lodash/get'

import './style.scss';
import { RacePropType, InfoPropType, ParticipantsPropType  } from 'utilities/scheme';

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


const RegistrationPage = ({ races, firestore, participants, selectedRace, changeRace, location, info}) => {
  const submit = values => {
    let race = races.filter(r => r.name == values.race)[0];
    values.raceRef = firestore.doc(`races/${race.id}`)
    addParticipant(firestore, values, participantsToRaceMap, race.limit);
  }
  const event = location.pathname.split('/', 2)[1]
  const availableRaces = !isLoaded(races) ? [] : races.filter(r => r.event == event && r.current)

  if (isLoaded(info) && !info.registration_open)
    return <NotFoundPage text="Registrace není otevřena"/>

  if (isLoaded(races) && availableRaces.length == 0 )
    return <NotFoundPage text="Registrace není přístupná"/>

  const initialRace = !isLoaded(races) ? undefined : availableRaces[0]

  const participantsToRaceMap = !isLoaded(races) || !isLoaded(participants)
  ? {}
  : availableRaces.reduce((obj, race) => {
      obj[race.id] = Object.values(participants).filter(p => p && p.raceRef && p.raceRef.id == race.id)
      return obj;
    }, {});

  const racesNamesList = !isLoaded(races) || availableRaces.length == 0
      ? []
      : availableRaces.map(
        elem => (
          <RaceItem
            className={"custom-font " + (elem.name === selectedRace ? "selectedRace" : "")}
            key={`race-${elem.id}`}
            onClick={() => changeRace(elem.name)}
            name={elem.name}
            count={participantsToRaceMap && participantsToRaceMap[elem.id] ? participantsToRaceMap[elem.id].length : 0}
            limit={elem.limit}
          />
        )
      )

  let localSelectedRace = isLoaded(races) && availableRaces.length > 0
    ? availableRaces.filter(r => r.name == selectedRace)[0]
    : undefined

  return !isLoaded(races) || !isLoaded(participants) ? <LoadingIndicator /> :
    (
      <div className="RegistrationPage">
        <List component='section' items={racesNamesList} />
        <section>
          <RaceDescription component='article' race={localSelectedRace} />
        </section>
        <section className="regForm">
          <RegistrationForm onSubmit={submit} initialRace={initialRace.name} />
        </section>
      </div>
    )
}

RegistrationPage.propTypes = {
  races: PropTypes.arrayOf(RacePropType),
  firestore: PropTypes.object.isRequired,
  participants: PropTypes.objectOf(ParticipantsPropType),
  selectedRace: PropTypes.string,
  changeRace: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  info: InfoPropType,
}

const mapStateToProps = (state, props) => ({
  races: state.firestore.ordered.races,
  participants: state.firestore.data.participants,
  selectedRace: formValueSelector('registration')(state, 'race'),
  info: get(state.firestore.data, `info_${props.location.pathname.split('/', 2)[1]}`),
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
      where: ['current', '==', true],
      orderBy: 'priority'
    },
    {
      collection: 'participants'
    },
    {
      collection: 'information',
      doc: location.pathname.split('/', 2)[1],
      storeAs: `info_${location.pathname.split('/', 2)[1]}`
    }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(RegistrationPage);
