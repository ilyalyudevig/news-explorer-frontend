import NewsCard from "./NewsCard";
import Preloader from "./Preloader";
import ApiError from "./ApiError";

import { useCurrentUser } from "../hooks/useCurrentUser";

function SavedNews({ handleDeleteArticle }) {
  const { savedArticles, isLoading, error } = useCurrentUser();

  return (
    <main className="main">
      {isLoading ? (
        <Preloader text={"Loading news..."} />
      ) : error ? (
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
