import Button from "./Button";
import NewsCard from "./NewsCard";

import { useState } from "react";

function SearchResults({
  searchResults,
  savedArticles,
  handleSaveArticle,
  handleDeleteArticle,
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className="search-results">
      <h2 className="search-results__title">Search results</h2>
      <div className="search-results__cards">
        {searchResults
          .slice(0, visibleCount)
          .map(({ source, title, publishedAt, content, urlToImage, url }) => {
            const isSaved = savedArticles.some(
              (savedArticle) => savedArticle.url == url
            );
            return (
              <NewsCard
                key={url}
                source={source}
                title={title}
                publishedAt={publishedAt}
                content={content}
                urlToImage={urlToImage}
                url={url}
                handleSaveArticle={handleSaveArticle}
                handleDeleteArticle={handleDeleteArticle}
                isSaved={isSaved}
                cardType="search-result"
              />
            );
          })}
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
