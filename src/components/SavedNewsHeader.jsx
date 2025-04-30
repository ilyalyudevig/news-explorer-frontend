import Navigation from "./Navigation";

function SavedNewsHeader() {
  return (
    <header className="header header--saved-news">
      <Navigation color={"black"} />
      <div className="header__saved-news-info">
        <p className="header__paragraph header__paragraph--saved-news">
          Saved articles
        </p>
        <h2 className="header__title header__title--saved-news">
          Elise, you have 5 saved articles
        </h2>
        <p className="header__paragraph header__paragraph--keywords">
          By keywords:{" "}
          <span className="header__keywords-bold">
            Nature, Yellowstone, and 2 other
          </span>
        </p>
      </div>
    </header>
  );
}
export default SavedNewsHeader;
