import logoutIcon from "../images/logout-icon.svg";
import logoutIconBlack from "../images/logout-icon-black.svg";
import Button from "./Button";

import { Link } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Navigation({ handleSignInModalOpen, handleLogout, color }) {
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);

  return (
    <nav className="header__nav nav">
      <Link className="nav__nav-link" to="/">
        <h1
          className={`nav__title ${
            color === "black" ? "nav__title--black" : ""
          }`}
        >
          NewsExplorer
        </h1>
      </Link>
      <ul className="nav__items">
        <li className="nav__item">
          <Link
            className={`nav__nav-link ${
              color === "black" ? "nav__nav-link--black" : ""
            }`}
            to="/"
          >
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="nav__item">
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
                buttonText={currentUser.username || "Loading..."}
                className={`nav__button nav__button--signout nav__button--${color}`}
                onClick={handleLogout}
              >
                <img
                  className="button__icon"
                  src={color === "black" ? logoutIconBlack : logoutIcon}
                />
              </Button>
            </li>
          </>
        ) : (
          <li className="nav__item">
            <Button
              buttonText="Sign in"
              className="nav__button nav__button--signin"
              onClick={handleSignInModalOpen}
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
export default Navigation;
