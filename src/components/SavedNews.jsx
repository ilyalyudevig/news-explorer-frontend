import NewsCard from "./NewsCard";
import Preloader from "./Preloader";
import ApiError from "./ApiError";

import { getToken } from "../utils/token";
import { useEffect } from "react";

function SavedNews({
  savedArticles,
  setSavedArticles,
  isLoading,
  setIsLoading,
  handleDeleteArticle,
  api,
  apiError,
  setApiError,
  extractAndSetKeywords,
}) {
  useEffect(() => {
    const token = getToken();
    setIsLoading(true);
    api
      .getSavedArticles(token)
      .then((articles) => {
        setSavedArticles(articles.reverse());
        extractAndSetKeywords(articles);
      })
      .catch((err) => {
        console.error(err);
        setApiError(err.message || "Error fetching saved articles");
      })
      .finally(() => setIsLoading(false));
    // This effect only needs to run once on the first render, and api, setIsLoading, and setSavedArticles are not expected to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="main">
      {isLoading ? (
        <Preloader />
      ) : apiError ? (
        <ApiError />
      ) : (
        <section className="saved-news">
          <div className="saved-news__cards">
            {savedArticles.map(
              ({
                source,
                title,
                publishedAt,
                content,
                urlToImage,
                url,
                keywords,
              }) => (
                <NewsCard
                  key={url}
                  source={source}
                  title={title}
                  publishedAt={publishedAt}
                  content={content}
                  urlToImage={urlToImage}
                  url={url}
                  handleDeleteArticle={handleDeleteArticle}
                  isSaved={true}
                  cardType={"saved"}
                  keywords={keywords}
                />
              )
            )}
          </div>
        </section>
      )}
    </main>
  );
}
export default SavedNews;
