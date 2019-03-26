/**
 * News
 *
 * Load and display articles
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import Article from 'components/Article';
import LoadingIndicator from 'components/LoadingIndicator';

import './style.scss';

const LegendsPage = ({ legends, event }) => {
  const legendsList = !isLoaded(legends)
    ? <LoadingIndicator />
    : isEmpty(legends)
      ? ''
      : Object.keys(legends).map(
        (key, id) => (
          <Article
            key={key}
            id={`legend-${key}`}
            title={legends[key].title}
            content={legends[key].content}
          />
        )
      )
  return (
    <div className="legendsPage">
      {legendsList}
    </div>
  )
}

export default compose(
  connect((state) => ({
    event: state.event
  })),
  firestoreConnect(({event}) => [
    {
      collection: "legends",
      doc: `${event.year}`,
      subcollections: [{ collection: event.name }],
      storeAs: 'curLegends'
      // collection: "legends",
    }
  ]),
  connect((state) => ({
    legends: state.firestore.data.curLegends
  }))
)(LegendsPage);
