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
  const renderSearchContent = () => {
    if (isLoading) {
      return <Preloader text="Searching for news..." />;
    }

    if (!searchAttempted) {
      return null;
    }

    if (apiError) {
      return <ApiError />;
    }

    if (searchResults.length === 0) {
      return <NothingFound />;
    }

    return (
      <SearchResults
        searchResults={searchResults}
        savedArticles={savedArticles}
        handleSaveArticle={handleSaveArticle}
        handleDeleteArticle={handleDeleteArticle}
      />
    );
  };

  return (
    <main className="main" aria-label="Main content">
      {renderSearchContent()}
      <About />
    </main>
  );
}
export default Main;
