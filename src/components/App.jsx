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

import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";
import { useCurrentUser } from "../hooks/useCurrentUser";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    savedArticles,
    keywords,
    setKeywords,
    login,
    register,
    logout,
    saveArticle,
    deleteArticle,
  } = useCurrentUser();

  const { activeModal, modalIsOpen, handleModalOpen, handleModalClose } =
    useModal();

  const searchApi = useApiCall();
  const authApi = useApiCall();

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = async (query) => {
    setSearchAttempted(true);
    const data = await searchApi.execute(getSearchResults, { query });
    const keywords = query.split(" ");

    const articlesWithKeywords = data.articles.map((article) => ({
      ...article,
      keywords,
    }));

    setSearchResults(articlesWithKeywords);
    setKeywords((prev) => {
      const allKeywords = [...prev, ...keywords];
      return allKeywords.filter(
        (keyword, index, self) => self.indexOf(keyword) === index
      );
    });
  };

  const handleLogin = async (inputValues) => {
    await authApi.execute(login, inputValues);
    handleModalClose();
  };

  const handleRegister = async (inputValues) => {
    await authApi.execute(register, inputValues);
    handleModalClose();
    handleModalOpen("success");
  };

  const handleLogout = () => {
    logout();
    setSearchResults([]);
    navigate("/", { replace: true });
  };

  const handleSaveArticle = async (article) => {
    await authApi.execute(saveArticle, article);
  };

  const handleDeleteArticle = async (url) => {
    await authApi.execute(deleteArticle, url);
  };

  return (
    <>
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
                handleDeleteArticle={handleDeleteArticle}
                isLoading={authApi.isLoading}
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
        apiError={authApi.error}
        dataTestId="sign-in-modal"
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
        dataTestId="sign-up-modal"
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
    </>
  );
}

export default App;
