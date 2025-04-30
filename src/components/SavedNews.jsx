import NewsCard from "./NewsCard";

function SavedNews() {
  return (
    <main className="main">
      <section className="saved-news">
        <div className="saved-news__cards">
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>
      </section>
    </main>
  );
}
export default SavedNews;
