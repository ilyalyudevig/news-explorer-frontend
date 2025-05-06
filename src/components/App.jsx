import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SavedNews from "./SavedNews";
import SavedNewsHeader from "./SavedNewsHeader";
import ProtectedRoute from "./ProtectedRoute";

import { getSearchResults } from "../utils/newsApi";

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [apiError, setApiError] = useState(
    "Sorry, something went wrong during the request. Please try again later."
  );
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModalOpen = (modalName) => {
    setActiveModal(modalName);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setActiveModal("");
    setModalIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setApiError(null);
    setSearchAttempted(true);
    try {
      const data = await getSearchResults({ query });
      setSearchResults(data.articles);
      setSearchAttempted(false);
    } catch (error) {
      setApiError(error.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO:
  const handleLogin = () => {};
  const handleRegister = () => {};
  const handleLogout = () => {};

  return (
    <CurrentUserContext.Provider value={{ isLoggedIn, currentUser }}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                handleSignInModalOpen={() => handleModalOpen("sign-in")}
                handleLogout={handleLogout}
                toggleMobileMenu={toggleMobileMenu}
                isMobileMenuOpen={isMobileMenuOpen}
                onSearch={handleSearch}
              />
              <Main
                isLoading={isLoading}
                searchResults={searchResults}
                searchAttempted={searchAttempted}
                apiError={apiError}
              />
            </>
          }
        />
        <Route
          path="/saved-news"
          element={
            <ProtectedRoute>
              <SavedNewsHeader />
              <SavedNews />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <LoginModal
        title="Sign in"
        name="sign-in"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign in"}
        switchBtnHandler={() => handleModalOpen("sign-up")}
        switchBtnText="Sign up"
        handleLogin={handleLogin}
      />
      <RegisterModal
        title="Sign up"
        name="sign-up"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign up"}
        switchBtnHandler={() => handleModalOpen("sign-in")}
        switchBtnText="Sign in"
        handleRegister={handleRegister}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
