import logoutIcon from "../images/logout-icon.svg";
import mobileMenuIcon from "../images/mobile-menu-icon.svg";
import mobileMenuIconBlack from "../images/mobile-menu-icon-black.svg";
import closeIcon from "../images/close-icon.svg";
import closeIconBlack from "../images/close-icon-black.svg";
import logoutIconBlack from "../images/logout-icon-black.svg";
import Button from "./Button";

import { Link } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Navigation({
  handleSignInModalOpen,
  handleLogout,
  color = "white",
  toggleMobileMenu,
  isMobileMenuOpen,
}) {
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);

  return (
    <nav
      className={`header__nav nav ${
        isMobileMenuOpen ? "nav--mobile-menu-open" : ""
      }`}
    >
      <Link className="nav__nav-link" to="/">
        <h1
          className={`nav__title ${
            color === "black" ? "nav__title--black" : ""
          }`}
        >
          NewsExplorer
        </h1>
      </Link>
      <Button className="nav__mobile-menu-btn" onClick={toggleMobileMenu}>
        {color === "black" ? (
          <img
            className="nav__mobile-menu-icon"
            src={isMobileMenuOpen ? closeIconBlack : mobileMenuIconBlack}
          />
        ) : (
          <img
            className="nav__mobile-menu-icon"
            src={isMobileMenuOpen ? closeIcon : mobileMenuIcon}
          />
        )}
      </Button>
      <ul
        className={`nav__items ${isMobileMenuOpen ? "nav__items--mobile" : ""}`}
      >
        <li
          className={`nav__item ${isMobileMenuOpen ? "nav__item--mobile" : ""}`}
        >
          <Link
            className={`nav__nav-link ${
              color === "black" ? "nav__nav-link--black" : ""
            } ${isMobileMenuOpen ? "nav__nav-link--mobile" : ""}`}
            to="/"
          >
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li
              className={`nav__item ${
                color === "black" ? "nav__item--black" : ""
              }`}
            >
              <Link
                className={`nav__nav-link ${
                  color === "black" ? "nav__nav-link--black" : ""
                }`}
                to="/saved-news"
              >
                Saved articles
              </Link>
            </li>
            <li className="nav__item">
              <Button
                buttonText={`${currentUser.username}${" "}`}
                className={`nav__button nav__button--signout nav__button--${color}`}
                onClick={handleLogout}
              >
                <img
                  className="nav__button-icon"
                  src={color === "black" ? logoutIconBlack : logoutIcon}
                />
              </Button>
            </li>
          </>
        ) : (
          <li
            className={`nav__item ${
              isMobileMenuOpen ? "nav__item--mobile" : ""
            }`}
          >
            <Button
              buttonText="Sign in"
              className={`nav__button nav__button--signin ${
                isMobileMenuOpen ? "nav__button--mobile" : ""
              }`}
              onClick={handleSignInModalOpen}
            />
          </li>
        )}
      </ul>
      <div
        className={`nav__overlay ${
          isMobileMenuOpen ? "nav__overlay--open" : ""
        }`}
      ></div>
    </nav>
  );
}
export default Navigation;
