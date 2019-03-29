import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import LoadingIndicator from 'components/LoadingIndicator';
import Article from 'components/Article';

import './style.scss';
import { RulesPropType } from 'propTypes';

const RulesPage = ({ rules, location }) => {
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
            title='' //{rule.title}
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

RulesPage.propTypes = {
  location: PropTypes.object.isRequired,
  rules: PropTypes.arrayOf(RulesPropType)
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
)(RulesPage);
