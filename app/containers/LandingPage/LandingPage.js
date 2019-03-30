import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './style.scss';
import Logo from 'components/Logo';

const LandingPage = () => (
  <nav className="LandingPage">
    <Helmet>
      <meta name="description" content="Vyber si Malenovskou, která tě zajímá" />
    </Helmet>
    <div className="panel panel--side">
      <Link className="panel-content router-link custom-font effect-lighter" to="/sarvatka/legends">Šarvátka</Link>
    </div>

    <div className="panel panel--center">
      <div className="panel-content logo">
        <Logo />
      </div>
    </div>

    <div className="panel panel--side">
      <Link className="panel-content router-link custom-font effect-darker" to="/bitva/legends">Bitva</Link>
    </div>
  </nav>
);

export default LandingPage;
