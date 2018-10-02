import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { change as changeFormFieldValue, formValueSelector } from 'redux-form';
import pick from 'lodash/pick';

import RegistrationForm from 'components/RegistrationForm';
import LoadingIndicator from 'components/LoadingIndicator';
import List from 'components/List';
import ListItem from 'components/ListItem';

import ReactMarkdown from 'react-markdown';

import './style.scss';

const addParticipant = (firestore, values) => {
  let publicData = pick(values, ['nickname', 'firstName', 'lastName', 'group', 'race', 'raceRef']);
  let privateData = pick(values, ['age', 'email']);

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
    values.raceRef = firestore.doc(`races/${races.filter(v => v.name == values.race)[0].id}`)
    addParticipant(firestore, values);
  }

  const participantsToRaceMap = !isLoaded(races) || !isLoaded(participants)
  ? {}
  : Object.assign(...Object.keys(races).map(
    ([key, value]) => ({
      [races[key].id]: Object.keys(participants).filter( k => participants[k] && participants[k].raceRef.id == races[key].id).length
    })
  ));

  const racesNamesList = !isLoaded(races) || isEmpty(races)
      ? []
      : Object.keys(races).map(
        (key) => (
          <a
            className={"title " + (races[key].name === selectedRace ? "selectedRace" : "")}
            key={`race-${key}`}
            onClick={() => changeRace(races[key].name)}
            >
            {races[key].name} <span>({participantsToRaceMap[races[key].id]}/{races[key].limit})</span>
          </a>
        )
      )

  let localSelectedRace = isLoaded(races) && !isEmpty(races) ? races.filter(v => v.name == selectedRace)[0] : undefined
  const racesDescription = !isLoaded(races) || isEmpty(races) || localSelectedRace === undefined
    ? <LoadingIndicator />
    : (
      <div>
        <ReactMarkdown className="legend" source={ localSelectedRace.legend.replace(/\\n/g,'\n') } />
        <p><b>{ localSelectedRace.description }</b></p>
      </div>
    )


  return (
    <div className="RegistrationPage">
      <section className="raceList">
        <List component={ListItem} items={racesNamesList} />
      </section>
      <section className="raceDesc">
        {racesDescription}
      </section>
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
    console.log(value)
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
