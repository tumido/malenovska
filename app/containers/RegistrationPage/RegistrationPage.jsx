import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

// import List from 'components/List';
import ListItem from 'components/ListItem';
import RegistrationForm from 'components/RegistrationForm';

import './style.scss';

const RegistrationPage = ({ races }) => {
  const submit = values => {
    console.log(values);
  }

  // const racesList = !isLoaded(races)
  //   ? [<LoadingIndicator />]
  //   : isEmpty(races)
  //     ? []
  //     : Object.keys(races).map(
  //       (key, id) => (
  //         <ListItem
  //           key={key}
  //           id={id}
  //           item={races[key].name}
  //         />
  //       )
  //     )
  return (
    <div className="RegistrationPage">
      <section>
        RaceSelect
      </section>
      <section>
        RaceDescription
      </section>
      <section>
        <RegistrationForm onSubmit={submit} />
      </section>
      {/* <List component="ListItem" items={racesList} /> */}
    </div>
  )
}

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
  connect((state) => ({
    races: state.firestore.data.races,
    participants: state.firestore.data.participants,
  }))
)(RegistrationPage);
