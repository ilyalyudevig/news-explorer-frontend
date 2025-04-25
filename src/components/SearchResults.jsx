import Button from "./Button";
import NewsCard from "./NewsCard";

function SearchResults() {
  return (
    <section className="search-results">
      <h2 className="search-results__title">Search results</h2>
      <div className="search-results__cards">
        <NewsCard />
        <NewsCard />
        <NewsCard />
      </div>
      <Button className="search-results__button" buttonText="Show more" />
    </section>
  );
}
export default SearchResults;
