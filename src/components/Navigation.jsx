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
  color,
  toggleMobileMenu,
  isMobileMenuOpen,
}) {
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);

  const navClasses = `header__nav nav ${
    isMobileMenuOpen ? "nav--mobile-menu-open" : ""
  }`;

  const titleClasses = `nav__title ${
    color === "black" ? "nav__title--black" : ""
  }`;

  const mobileMenuIconSrc = isMobileMenuOpen
    ? color === "black"
      ? closeIconBlack
      : closeIcon
    : color === "black"
    ? mobileMenuIconBlack
    : mobileMenuIcon;

  const navItemsClasses = `nav__items ${
    isMobileMenuOpen ? "nav__items--mobile" : ""
  }`;
  const navItemBaseClasses = `nav__item ${
    isMobileMenuOpen ? "nav__item--mobile" : ""
  }`;

  const homeLinkClasses = `nav__nav-link ${
    color === "black" ? "nav__nav-link--black" : ""
  } ${isMobileMenuOpen ? "nav__nav-link--mobile" : ""}`;

  const savedArticlesLinkClasses = `nav__nav-link ${
    isMobileMenuOpen ? "nav__nav-link--mobile" : ""
  } ${color === "black" ? "nav__nav-link--black" : ""}`;

  const signOutButtonClasses = `nav__button nav__button--signout nav__button--${color} ${
    isMobileMenuOpen ? "nav__button--mobile" : ""
  }`;

  const signInButtonClasses = `nav__button nav__button--signin ${
    isMobileMenuOpen ? "nav__button--mobile" : ""
  }`;

  const logoutIconSrc = color === "black" ? logoutIconBlack : logoutIcon;

  const overlayClasses = `nav__overlay ${
    isMobileMenuOpen ? "nav__overlay--open" : ""
  }`;

  return (
    <nav className={navClasses}>
      <Link className="nav__nav-link" to="/">
        <h1 className={titleClasses}>NewsExplorer</h1>
      </Link>
      <Button className="nav__mobile-menu-btn" onClick={toggleMobileMenu}>
        <img className="nav__mobile-menu-icon" src={mobileMenuIconSrc} />
      </Button>
      <ul className={navItemsClasses}>
        <li className={navItemBaseClasses}>
          <Link className={homeLinkClasses} to="/">
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li
              className={`${navItemBaseClasses} ${
                color === "black" ? "nav__item--black" : ""
              }`}
            >
              <Link className={savedArticlesLinkClasses} to="/saved-news">
                Saved articles
              </Link>
            </li>
            <li className={navItemBaseClasses}>
              <Button
                buttonText={currentUser.username}
                className={signOutButtonClasses}
                onClick={handleLogout}
              >
                <img className="nav__button-icon" src={logoutIconSrc} />
              </Button>
            </li>
          </>
        ) : (
          <li className={navItemBaseClasses}>
            <Button
              buttonText="Sign in"
              className={signInButtonClasses}
              onClick={handleSignInModalOpen}
            />
          </li>
        )}
      </ul>
      <div className={overlayClasses}></div>
    </nav>
  );
}
export default Navigation;
