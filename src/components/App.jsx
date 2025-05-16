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
  const [keywords, setKeywords] = useState([]);

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
      const keywords = query.split(" ");
      data.articles.forEach((article) => (article["keywords"] = keywords));
      setKeywords((prev) => {
        const allKeywords = [...prev, ...keywords];
        return allKeywords.filter(
          (keyword, index, self) => self.indexOf(keyword) === index
        );
      });
      setSearchResults(data.articles);
      setSearchAttempted(false);
    } catch (error) {
      setApiError(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      .catch((err) => {
        console.error(err);
        setApiError(err.message || "Login failed");
      })
      .finally(() => setIsLoading(false));
  };

  const handleRegister = (inputValues) => {
    setIsLoading(true);
    return auth
      .register(inputValues)
      .then(handleModalClose)
      .then(() => handleModalOpen("success"))
      .catch((err) => {
        console.error(err);
        setApiError(err.message || "Registration failed");
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    removeToken();
    setSearchResults([]);
    setIsLoggedIn(false);
  };

  const handleSaveArticle = (article) => {
    const token = getToken();
    api
      .saveArticle(article, token)
      .then(() => setSavedArticles((prev) => [article, ...prev]))
      .catch((err) => {
        console.error(err);
        setApiError(err.message || "Error during saving an article");
      });
  };

  const handleDeleteArticle = (url) => {
    const token = getToken();
    const article = savedArticles.find((article) => article.url === url);
    api
      .deleteArticle(article._id, token)
      .then(() =>
        setSavedArticles((prev) =>
          prev.filter((article) => article.url !== url)
        )
      )
      .catch((err) => {
        console.error(err);
        setApiError(err.message || "Error during deleting an article");
      });
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
              <SavedNewsHeader
                savedArticles={savedArticles}
                handleLogout={handleLogout}
                keywords={keywords}
                toggleMobileMenu={toggleMobileMenu}
                isMobileMenuOpen={isMobileMenuOpen}
              />
              <SavedNews
                savedArticles={savedArticles}
                setSavedArticles={setSavedArticles}
                handleDeleteArticle={handleDeleteArticle}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                api={api}
                apiError={apiError}
                setApiError={setApiError}
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
        apiError={apiError}
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
