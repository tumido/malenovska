import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import LoadingIndicator from 'components/LoadingIndicator';
import Map from 'components/Map';
import List from 'components/List';

import './style.scss';

const InfoPage = ({info}) => {
  if (!isLoaded(info) || isEmpty(info)) return <LoadingIndicator />;

  return (
    <div className="InfoPage">
      <section className="info">
        <List items={contacts}/>
      </section>
      <Map className="map" markers={info.poi} />
    </div>
  )
}

export default compose(
  firestoreConnect([
    {
      collection: 'information',
      doc: 'bitva',
      storeAs: 'info'
    }
  ]),
  connect((state) => ({
    info: state.firestore.data['info'],
  }))
)(InfoPage);
