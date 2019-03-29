/**
 * News
 *
 * Load and display articles
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import get from 'lodash/get'

import Article from 'components/Article';
import LoadingIndicator from 'components/LoadingIndicator';

import './style.scss';

const LegendsPage = ({ legends }) => {
  const legendsList = !isLoaded(legends)
    ? <LoadingIndicator />
    : isEmpty(legends)
      ? <Article id="legend-not-found" title='Néni nic!' content='Bohužel nemáme co nabídnout'/>
      : Object.keys(legends).map(
        (key, id) => (
          <Article
            key={key}
            id={`legend-${key}`}
            title={legends[key].title}
            content={legends[key].content}
            // trucated={true}
            // trucateSettings={{
            //   'length': 300
            // }}
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
  firestoreConnect(({location}) => [
    {
      collection: "legends",
      where: ['event', '==', location.pathname.split('/', 2)[1]],
      storeAs: `legends_${location.pathname.split('/', 2)[1]}`
      // collection: "legends",
    }
  ]),
  connect((state, props) => ({
    legends: get(state.firestore.data, `legends_${props.location.pathname.split('/', 2)[1]}`)
  }))
)(LegendsPage);
