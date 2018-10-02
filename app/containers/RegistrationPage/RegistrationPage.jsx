import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { change as changeFormFieldValue, formValueSelector } from 'redux-form';

import RegistrationForm from 'components/RegistrationForm';
import LoadingIndicator from 'components/LoadingIndicator';
import List from 'components/List';
import ListItem from 'components/ListItem';

import ReactMarkdown from 'react-markdown';

import './style.scss';

const RegistrationPage = ({ races, firestore, participants, selectedRace, changeRace }) => {
  const submit = values => {
    values.raceRef = firestore.doc(`races/${races.filter(v => v.name == values.race)[0].id}`)
    console.log(values);
    firestore.collection('participants').add(values)
    .then(result => {
      alert(`${values.race} tě přijímají do svých řad.\n\nSpolehlivě upsáno! 🍺`)
    })
    .catch(err => {
      alert("Něco se nepovedlo. Dejte nám vědět, prosím...")
    })
  }

  const participantsToRaceMap = !isLoaded(races) || !isLoaded(participants)
  ? {}
  : Object.assign(...Object.keys(races).map(
    ([key, value]) => ({
      [races[key].id]: Object.keys(participants).filter( k => participants[k] && participants[k].raceRef.id == races[key].id).length
    })
  ));
  console.log(participantsToRaceMap)

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
      where: [
        ['current', '==', true]
      ]
    },
    {
      collection: 'participants'
    }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(RegistrationPage);
