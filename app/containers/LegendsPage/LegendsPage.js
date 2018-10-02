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

const LegendsPage = ({ legends, firestore }) => {
  const legendsList = !isLoaded(legends)
    ? <LoadingIndicator />
    : isEmpty(legends)
      ? ''
      : Object.keys(legends).map(
        (key, id) => (
          <Article
            key={key}
            id={`article-${id}`}
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
  firestoreConnect([
    {
      collection: 'legends',
      where: [
        ['current', '==', true]
      ]
    }
  ]),
  connect((state) => ({
    legends: state.firestore.data.legends,
  }))
)(LegendsPage);
