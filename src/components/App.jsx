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
import { Routes, Route, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";

import { api } from "../utils/api";
import * as auth from "../utils/auth";
import { setToken, getToken, removeToken } from "../utils/token";
import Preloader from "./Preloader";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const { activeModal, modalIsOpen, handleModalOpen, handleModalClose } =
    useModal();

  const authApi = useApiCall();
  const searchApi = useApiCall();
  const articlesApi = useApiCall();

  const navigate = useNavigate();

  const extractAndSetKeywords = (articles) => {
    const articleKeywords = articles
      .map((article) => article.keywords)
      .flat()
      .filter(Boolean);

    setKeywords((prev) => {
      const allKeywords = [...prev, ...articleKeywords];
      return allKeywords.filter(
        (keyword, index, self) => self.indexOf(keyword) === index
      );
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = async (query) => {
    setSearchAttempted(true);
    try {
      const data = await searchApi.execute(getSearchResults, { query });
      const keywords = query.split(" ");
      data.articles.forEach((article) => (article["keywords"] = keywords));
      setKeywords((prev) => {
        const allKeywords = [...prev, ...keywords];
        return allKeywords.filter(
          (keyword, index, self) => self.indexOf(keyword) === index
        );
      });
      setSearchResults(data.articles);
    } finally {
      setSearchAttempted(false);
    }
  };

  const handleLogin = async (inputValues) => {
    const data = await authApi.execute(auth.authorize, inputValues);
    if (!data.token) {
      throw new Error("No token received");
    }
    setToken(data.token);

    const user = await authApi.execute(auth.checkToken, data.token);
    setCurrentUser(user);
    setIsLoggedIn(true);

    const token = getToken();
    const articles = await articlesApi.execute(() => api.getSavedArticles(token));
    setSavedArticles(articles.reverse());
    extractAndSetKeywords(articles);

    handleModalClose();
  };

  const handleRegister = async (inputValues) => {
    await authApi.execute(auth.register, inputValues);
    handleModalClose();
    handleModalOpen("success");
  };

  const handleLogout = () => {
    removeToken();
    setSearchResults([]);
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const handleSaveArticle = async (article) => {
    const token = getToken();
    const savedArticle = await articlesApi.execute(() => api.saveArticle(article, token));
    setSavedArticles((prevArticles) => [savedArticle, ...prevArticles]);
    extractAndSetKeywords([savedArticle]);
  };

  const handleDeleteArticle = async (url) => {
    const token = getToken();
    const articleToDelete = savedArticles.find(
      (article) => article.url === url
    );
    await articlesApi.execute(() => api.deleteArticle(articleToDelete._id, token));

    const updatedSavedArticles = savedArticles.filter(
      (article) => article._id !== articleToDelete._id
    );
    setSavedArticles(() => updatedSavedArticles.reverse());
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      try {
        const user = await authApi.execute(auth.checkToken, token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        const articles = await articlesApi.execute(() => api.getSavedArticles(token));
        setSavedArticles(articles.reverse());
        extractAndSetKeywords(articles);
      } catch {
        removeToken();
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authApi.isLoading) {
    return <Preloader text={"Loading..."} />;
  }

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
                isLoading={searchApi.isLoading}
                searchResults={searchResults}
                savedArticles={savedArticles}
                searchAttempted={searchAttempted}
                apiError={searchApi.error}
                handleSaveArticle={handleSaveArticle}
                handleDeleteArticle={handleDeleteArticle}
              />
            </>
          }
        />
        <Route
          path="/saved-news"
          element={
            <ProtectedRoute
              handleSigninModalOpen={() => handleModalOpen("sign-in")}
            >
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
                isLoading={articlesApi.isLoading}
                api={api}
                extractAndSetKeywords={extractAndSetKeywords}
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
        apiError={authApi.error}
      />
      <SuccessModal
        title="Registration successfully completed!"
        name="success"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign in"}
        handleModalOpen={() => handleModalOpen("sign-in")}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
