import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header>
        <div className="logo">
          <Link className="router-link" to="/">
            <img src="" alt="Logo Zlišky" />
          </Link>
          Malenovská
        </div>
        <div className="nav-bar">
          <Link className="router-link" to="/news">
            Zprávy z bojiště
          </Link>
          <Link className="router-link" to="/rules">
            Pravidla střetu
          </Link>
          <Link className="router-link" to="/world">
            Historie Mezihoří
          </Link>
          <Link className="router-link" to="/info">
            Důležité informace
          </Link>
          <Link className="router-link" to="/registration">
            Registrace
          </Link>
        </div>
      </header>
    );
  }
}

export default Header;
