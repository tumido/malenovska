import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './style.scss';
import Logo from 'components/Logo';

const LandingPage = () => (
  <div className="landing-page">
    <Helmet>
      <meta name="description" content="Vyber si Malenovskou, která tě zajímá" />
    </Helmet>
    <nav className="main">
      <div className="panel">
        <Link className="panel-content router-link custom-font effect-lighter" to="/sarvatka/legends">Šarvátka</Link>
      </div>

      <div className="panel logo-panel">
        <div className="panel-content logo">
          <Logo />
        </div>
      </div>

      <div className="panel">
        <Link className="panel-content router-link custom-font effect-darker" to="/bitva/legends">Bitva</Link>
      </div>
    </nav>
  </div>
);

export default LandingPage;
