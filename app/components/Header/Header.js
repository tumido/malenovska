import React from 'react';
import { Link } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu';
import {decorator as reduxBurgerMenu} from 'redux-burger-menu';
import Logo from 'components/Logo';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Menu
        pageWrapId={ "app-content" }
        outerContainerId={ "app-wrapper" }
        customBurgerIcon={
          <span>
            <span className="bm-burger-bars"></span><span className="bm-burger-bars"></span><span className="bm-burger-bars"></span>
          </span>
        }
      >
        <Link to="/" className="bm-item__logo">
          <Logo />
        </Link>
        <Link className="router-link title" to="/bitva/legends">
          <i class="fas fa-book-open"></i>Zprávy z bojiště
        </Link>
        <Link className="router-link title" to="/bitva/rules">
          <i class="fas fa-balance-scale"></i> Pravidla střetu
        </Link>
        <Link className="router-link title" to="/bitva/info">
          <i class="fas fa-map-marker-alt"></i> Důležité informace
        </Link>
        <Link className="router-link title bm-item--highlight" to="/bitva/registration">
          <i class="fas fa-address-card"></i>Registrace
        </Link>
      </Menu>
    );
  }
}

export default reduxBurgerMenu(Header);
