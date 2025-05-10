import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SuccessModal from "./SuccessModal";
import SavedNews from "./SavedNews";
import SavedNewsHeader from "./SavedNewsHeader";
import ProtectedRoute from "./ProtectedRoute";

import { getSearchResults } from "../utils/newsApi";

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import { api } from "../utils/api";
import * as auth from "../utils/auth";
import { setToken, getToken, removeToken } from "../utils/token";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);

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
      setApiError(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO:
  const handleLogin = (inputValues) => {
    setIsLoading(true);
    return auth
      .authorize(inputValues)
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          return auth.checkToken(data.token);
        }
      })
      .then(setCurrentUser)
      .then(setIsLoggedIn(true))
      .then(() => api.getSavedArticles())
      .then(setSavedArticles)
      .then(handleModalClose)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleRegister = (inputValues) => {
    setIsLoading(true);
    return auth
      .register(inputValues)
      .then(handleModalClose)
      .then(() => handleModalOpen("success"))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    removeToken();
    setSearchResults([]);
    setIsLoggedIn(false);
  };

  const handleSaveArticle = (article) => {
    setSavedArticles((prev) => [article, ...prev]);
  };

  const handleDeleteArticle = (url) => {
    setSavedArticles((prev) => prev.filter((article) => article.url !== url));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    auth
      .checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

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
                savedArticles={savedArticles}
                searchAttempted={searchAttempted}
                apiError={apiError}
                handleSaveArticle={handleSaveArticle}
                handleDeleteArticle={handleDeleteArticle}
              />
            </>
          }
        />
        <Route
          path="/saved-news"
          element={
            <ProtectedRoute>
              <SavedNewsHeader savedArticles={savedArticles} />
              <SavedNews
                savedArticles={savedArticles}
                handleDeleteArticle={handleDeleteArticle}
              />
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
      <SuccessModal
        title="Registration successfully completed!"
        name="success"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign in"}
        handleLogin={handleLogin}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
