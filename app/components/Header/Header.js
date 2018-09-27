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
          <Link className="router-link" to="/bitva/legends">
            Zprávy z bojiště
          </Link>
          <Link className="router-link" to="/bitva/rules">
            Pravidla střetu
          </Link>
          <Link className="router-link" to="/bitva/world">
            Historie Mezihoří
          </Link>
          <Link className="router-link" to="/bitva/info">
            Důležité informace
          </Link>
          <Link className="router-link" to="/bitva/registration">
            Registrace
          </Link>
        </div>
      </header>
    );
  }
}

export default Header;
