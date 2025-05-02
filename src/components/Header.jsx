import backgroundImg from "../images/background-image.png";
import Navigation from "./Navigation";
import SearchForm from "./SearchForm";

function Header({
  handleSignInModalOpen,
  handleLogout,
  toggleMobileMenu,
  isMobileMenuOpen,
}) {
  return (
    <header className="header">
      <Navigation
        handleSignInModalOpen={handleSignInModalOpen}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div
        className={`header__content ${
          isMobileMenuOpen ? "header__content--mobile" : ""
        }`}
      >
        <h1 className="header__title">What's going on in the&nbsp;world?</h1>
        <p className="header__paragraph">
          Find the latest news on any topic and save them in your personal
          account.
        </p>
        <SearchForm />
      </div>
      <img className="header__bg-image" src={backgroundImg} />
    </header>
  );
}
export default Header;
