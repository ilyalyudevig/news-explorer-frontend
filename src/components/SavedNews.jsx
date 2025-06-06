import NewsCard from "./NewsCard";
import Preloader from "./Preloader";
import ApiError from "./ApiError";

import { useApiCall } from "../hooks/useApiCall";
import { useCurrentUser } from "../hooks/useCurrentUser";

function SavedNews({ handleDeleteArticle }) {
  const { savedArticles } = useCurrentUser();
  const articlesApi = useApiCall();

  return (
    <main className="main">
      {articlesApi.isLoading ? (
        <Preloader text={"Loading news..."} />
      ) : articlesApi.error ? (
        <ApiError />
      ) : (
        <section className="saved-news" data-testid="saved-news-content">
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
