import React from 'react';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
// import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import Article from 'components/Article';

import './style.scss';

const InfoPage = () => {
  return (
    <div className="InfoPage">
      <Article title="Připravujeme" content="Víme bitva bude 27.10.2018 a budeme rádi, když přijdete v 9:00." />
    </div>
  )
}

export default InfoPage;
