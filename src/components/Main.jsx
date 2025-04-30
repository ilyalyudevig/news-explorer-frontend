import About from "./About";
import Preloader from "./Preloader";
import SearchResults from "./SearchResults";

function Main({ isLoading }) {
  return (
    <main className="main">
      {isLoading ? <Preloader /> : <SearchResults />}
      <About />
    </main>
  );
}
export default Main;
