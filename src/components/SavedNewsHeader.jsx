import Navigation from "./Navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";

function SavedNewsHeader({
  savedArticles,
  handleLogout,
  keywords,
  toggleMobileMenu,
  isMobileMenuOpen,
}) {
  const { currentUser } = useCurrentUser();
  return (
    <header className="header header--saved-news">
      <Navigation
        color="black"
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="header__saved-news-info">
        <p className="header__paragraph header__paragraph--saved-news">
          Saved articles
        </p>
        <h2 className="header__title header__title--saved-news">
          {`${currentUser.name}, you have ${savedArticles.length} saved articles`}
        </h2>
        <p className="header__paragraph header__paragraph--keywords">
          By keywords:{" "}
          <span className="header__keywords-bold">{keywords.join(", ")}</span>
        </p>
      </div>
    </header>
  );
}
export default SavedNewsHeader;
