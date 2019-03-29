import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import LoadingIndicator from 'components/LoadingIndicator';
import Article from 'components/Article';
import './style.scss';

const Rules = ({ rules }) => {
  const event = location.pathname.split('/', 2)[1]

  const rulesList = !isLoaded(rules)
  ? <LoadingIndicator />
  : isEmpty(rules)
    ? ''
    : rules.map(rule => (
        !rule.event.includes(event)
        ? ''
        : <Article
            key={rule.id}
            id={`rule-${rule.id}`}
            // title={rule.title}
            content={rule.content}
          />
      )
    )

  return (
    <div className="rulesPage">
      {rulesList}
    </div>
  );
}

export default compose(
  firestoreConnect([
    {
      collection: 'rules',
      orderBy: 'priority',
    }
  ]),
  connect((state) => ({
    rules: state.firestore.ordered.rules,
  }))
)(Rules);
