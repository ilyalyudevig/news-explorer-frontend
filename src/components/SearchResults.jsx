import Button from "./Button";
import NewsCard from "./NewsCard";

import { useState } from "react";

function SearchResults({ searchResults, apiError }) {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className="search-results">
      <h2 className="search-results__title">Search results</h2>
      <div className="search-results__cards">
        {apiError ? (
          <div className="search-results__api-error">{apiError}</div>
        ) : (
          searchResults
            .slice(0, visibleCount)
            .map(
              ({ source, title, publishedAt, content, urlToImage }, index) => (
                <NewsCard
                  key={index}
                  source={source}
                  title={title}
                  publishedAt={publishedAt}
                  content={content}
                  urlToImage={urlToImage}
                />
              )
            )
        )}
      </div>
      {visibleCount < searchResults.length && (
        <Button
          className="search-results__button"
          buttonText="Show more"
          onClick={handleShowMore}
        />
      )}
    </section>
  );
}
export default SearchResults;
