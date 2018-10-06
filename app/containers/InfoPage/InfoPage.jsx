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

  console.log(info.date)
  let date = info.date ? info.date.toDate() : undefined;
  const dateString = !date ? "" : date.toLocaleDateString('cs-CZ')
  const timeString = !date ? "" : date.getHours() + ":" + date.getMinutes();

  const contacts = Object.values(info.contact).map(contact => (
    <li>
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
