import logoutIcon from "../images/logout-icon.svg";
import mobileMenuIcon from "../images/mobile-menu-icon.svg";
import mobileMenuIconBlack from "../images/mobile-menu-icon-black.svg";
import closeIcon from "../images/close-icon.svg";
import logoutIconBlack from "../images/logout-icon-black.svg";
import Button from "./Button";

import { Link } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";

function Navigation({
  handleSignInModalOpen,
  handleLogout,
  color,
  toggleMobileMenu,
  isMobileMenuOpen,
}) {
  const { isLoggedIn, currentUser } = useCurrentUser();

  const navClasses = `header__nav nav ${
    isMobileMenuOpen ? "nav--mobile-menu-open" : ""
  }`;

  const titleClasses = `nav__title ${
    color === "black" && !isMobileMenuOpen ? "nav__title--black" : ""
  }`;

  const mobileMenuIconSrc = isMobileMenuOpen
    ? closeIcon
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
    color === "black" && !isMobileMenuOpen ? "nav__nav-link--black" : ""
  } ${isMobileMenuOpen ? "nav__nav-link--mobile" : ""}`;

  const savedArticlesLinkClasses = `nav__nav-link ${
    isMobileMenuOpen ? "nav__nav-link--mobile" : ""
  } ${color === "black" && !isMobileMenuOpen ? "nav__nav-link--black" : ""}`;

  const signOutButtonClasses = `nav__button nav__button--signout ${
    color === "black" && !isMobileMenuOpen
      ? "nav__button--black"
      : "nav__button--mobile"
  }`;

  const signInButtonClasses = `nav__button nav__button--signin ${
    isMobileMenuOpen ? "nav__button--mobile" : ""
  }`;

  const logoutIconSrc =
    color === "black" && !isMobileMenuOpen ? logoutIconBlack : logoutIcon;

  const overlayClasses = `nav__overlay ${
    isMobileMenuOpen ? "nav__overlay--open" : ""
  }`;

  return (
    <nav className={navClasses} aria-label="Main navigation">
      <Link className="nav__nav-link" to="/">
        <span className={titleClasses} aria-label="NewsExplorer logo">
          NewsExplorer
        </span>
      </Link>
      <Button
        className="nav__mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <img
          className="nav__mobile-menu-icon"
          src={mobileMenuIconSrc}
          alt=""
          aria-hidden="true"
        />
      </Button>
      <ul className={navItemsClasses} role="menubar">
        <li className={navItemBaseClasses} role="none">
          <Link
            className={homeLinkClasses}
            to="/"
            role="menuitem"
            onClick={() => {
              if (isMobileMenuOpen) {
                toggleMobileMenu();
              }
            }}
          >
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li
              className={`${navItemBaseClasses} ${
                color === "black" && !isMobileMenuOpen ? "nav__item--black" : ""
              }`}
              role="none"
            >
              <Link
                className={savedArticlesLinkClasses}
                to="/saved-news"
                role="menuitem"
                data-testid="nav-link-savednews"
                onClick={() => {
                  if (isMobileMenuOpen) {
                    toggleMobileMenu();
                  }
                }}
              >
                Saved articles
              </Link>
            </li>
            <li className={navItemBaseClasses} role="none">
              <Button
                buttonText={currentUser.name.split(" ")[0]}
                className={signOutButtonClasses}
                onClick={handleLogout}
                role="menuitem"
                aria-label="Sign out"
                dataTestId="nav-button-signout"
              >
                <img
                  className="nav__button-icon"
                  src={logoutIconSrc}
                  alt=""
                  aria-hidden="true"
                />
              </Button>
            </li>
          </>
        ) : (
          <li className={navItemBaseClasses} role="none">
            <Button
              buttonText="Sign in"
              className={signInButtonClasses}
              onClick={handleSignInModalOpen}
              role="menuitem"
              aria-label="Sign in"
              dataTestId="nav-button-signin"
            />
          </li>
        )}
      </ul>
      <div className={overlayClasses} aria-hidden={!isMobileMenuOpen}></div>
    </nav>
  );
}
export default Navigation;
