import NewsCard from "./NewsCard";

function SavedNews({ savedArticles, handleDeleteArticle }) {
  return (
    <main className="main">
      <section className="saved-news">
        <div className="saved-news__cards">
          {savedArticles.map(
            ({ source, title, publishedAt, content, urlToImage, url }) => (
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
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}
export default SavedNews;
