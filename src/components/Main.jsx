import About from "./About";
import Preloader from "./Preloader";
import SearchResults from "./SearchResults";
import NothingFound from "./NothingFound";

function Main({ isLoading, searchResults, searchAttempted, apiError }) {
  return (
    <main className="main">
      {isLoading ? (
        <Preloader />
      ) : searchAttempted && searchResults.length === 0 ? (
        <NothingFound />
      ) : (
        searchResults.length > 0 && (
          <SearchResults searchResults={searchResults} apiError={apiError} />
        )
      )}
      <About />
    </main>
  );
}
export default Main;
