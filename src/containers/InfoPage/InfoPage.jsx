import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import get from 'lodash/get'

import { Loading } from 'components';
import Map from 'components/Map';
import List from 'components/List';

import './style.scss';
import { InfoPropType } from 'utilities/scheme';

const InfoPage = ({info}) => {
  if (!isLoaded(info) || isEmpty(info)) return <Loading />;

  let date = info.date ? info.date.toDate() : undefined;
  const dateString = !date ? "" : date.toLocaleDateString('cs-CZ')
  const timeString = !date ? "" : date.getHours() + ":" + date.getMinutes();

  const contacts = Object.entries(info.contact).map(([key, contact]) => (
    <li key={`contact-${key}`}>
      <a href={contact.href}><i className={contact.icon}></i> {contact.label}</a>
    </li>
  ))

  return (
    <div className="InfoPage">
      <section className="info custom-font">
        <div>
          <p>Datum: <span className="right"><strong>{dateString}</strong></span></p>
          <p>Čas: <span className="right"><strong>{timeString}</strong></span></p>
        </div>
        <div>
          <p>Cena: <span className="right"><strong>{info.price}</strong> Kč</span></p>
        </div>
        <div>
          <p>Kontakt:</p>
          <List items={contacts}/>
        </div>
        <div>
          <p>Harmonogram: </p>
        </div>
      </section>
      <Map className="map" markers={info.poi} />
    </div>
  )
}

InfoPage.propTypes = {
  info: InfoPropType,
}

export default compose(
  firestoreConnect([
    {
      collection: 'information',
    }
  ]),
  connect((state, props) => ({
    info: get(state.firestore.data.information, props.location.pathname.split('/', 2)[1]),
  }))
)(InfoPage);
