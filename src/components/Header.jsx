import backgroundImg from "../images/background-image.avif";
import Navigation from "./Navigation";
import SearchForm from "./SearchForm";

function Header({
  handleSignInModalOpen,
  handleLogout,
  toggleMobileMenu,
  isMobileMenuOpen,
  onSearch,
}) {
  return (
    <header className="header" id="header">
      <Navigation
        handleSignInModalOpen={handleSignInModalOpen}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        color="white"
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
        <SearchForm onSearch={onSearch} />
      </div>
      <img
        className="header__bg-image"
        src={backgroundImg}
        alt="Background image"
        aria-hidden="true"
        fetchPriority="high"
        data-testid="header-bg-image"
      />
    </header>
  );
}
export default Header;
