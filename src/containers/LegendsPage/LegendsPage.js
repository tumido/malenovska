/**
 * News
 *
 * Load and display articles
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import get from 'lodash/get'

import Article from 'components/Article';
import LoadingIndicator from 'components/LoadingIndicator';

import './style.scss';
import { LegendPropType } from 'propTypes';

const LegendsPage = ({ legends }) => {
  const legendsList = !isLoaded(legends)
    ? ''
    : isEmpty(legends)
      ? <Article id="legend-not-found" title='Néni nic!' content='Bohužel, příběhy došly, vraťte se prosím později...'/>
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

LegendsPage.propTypes = {
  legends: PropTypes.objectOf(LegendPropType)
}

export default compose(
  firestoreConnect(({ event }) => [
    {
      collection: "legends",
      // where: ['event', '==', location.pathname.split('/', 2)[1]],
      // storeAs: `legends_${location.pathname.split('/', 2)[1]}`
      // collection: "legends",
    }
  ]),
  connect((state, props) => ({
    legends: state.firestore.data.legends
  }))
)(LegendsPage);
