import NewsCard from "./NewsCard";
import Preloader from "./Preloader";
import ApiError from "./ApiError";

import { getToken } from "../utils/token";
import { useEffect } from "react";

import { useApiCall } from "../hooks/useApiCall";

function SavedNews({
  savedArticles,
  setSavedArticles,
  handleDeleteArticle,
  api,
  extractAndSetKeywords,
}) {
  const { execute, isLoading, apiError } = useApiCall();

  useEffect(() => {
    const token = getToken();
    execute(() => api.getSavedArticles(token)).then((articles) => {
      setSavedArticles(articles.reverse());
      extractAndSetKeywords(articles);
    });
    // This effect only needs to run once on the first render, and execute, api, setSavedArticles, and extractAndSetKeywords are not expected to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="main">
      {isLoading ? (
        <Preloader text={"Loading news..."} />
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
