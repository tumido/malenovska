import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { change as changeFormFieldValue, formValueSelector } from 'redux-form';

import RegistrationForm from 'components/RegistrationForm';
import LoadingIndicator from 'components/LoadingIndicator';
import ReactMarkdown from 'react-markdown';

import './style.scss';

const RegistrationPage = ({ races, firestore, participants, selectedRace, changeRace }) => {
  const submit = values => {
    firestore.runTransaction(t => {
      values.raceRef = firestore.doc(`races/${values.race}`)
      console.log(values);
      t.add('participants', values);
    })
    .then(result => {
      alert("Success")
    })
    .catch(err => {
      alert("Failed")
    })
  }

  const racesNamesList = !isLoaded(races) || isEmpty(races)
      ? <LoadingIndicator />
      : Object.keys(races).map(
        (key, id) => (
          <a
            key={key}
            id={`race-${id}`}
            onClick={() => changeRace(races[key].id)}
            >
            {races[key].name}
          </a>
        )
      )

  let localSelectedRace = isLoaded(races) && !isEmpty(races) ? races.filter(v => v.id == selectedRace)[0] : undefined
  const racesDescription = !isLoaded(races) || isEmpty(races) || localSelectedRace === undefined
    ? ""
    : <ReactMarkdown source={ localSelectedRace.description.replace(/\\n/g,'\n') } />

  return (
    <div className="RegistrationPage">
      <article>
        {racesNamesList}
      </article>
      <article>
        {racesDescription}
      </article>
      <article>
        <RegistrationForm onSubmit={submit} />
      </article>
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
