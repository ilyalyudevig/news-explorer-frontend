import About from "./About";
import Preloader from "./Preloader";
import SearchResults from "./SearchResults";
import NothingFound from "./NothingFound";
import ApiError from "./ApiError";

function Main({
  isLoading,
  searchResults,
  savedArticles,
  searchAttempted,
  apiError,
  handleSaveArticle,
  handleDeleteArticle,
}) {
  return (
    <main className="main" aria-label="Main content">
      {isLoading ? (
        <Preloader />
      ) : searchAttempted && apiError ? (
        <ApiError />
      ) : searchAttempted && !apiError && searchResults.length === 0 ? (
        <NothingFound />
      ) : (
        searchResults.length > 0 && (
          <SearchResults
            searchResults={searchResults}
            savedArticles={savedArticles}
            handleSaveArticle={handleSaveArticle}
            handleDeleteArticle={handleDeleteArticle}
          />
        )
      )}
      <About />
    </main>
  );
}
export default Main;
