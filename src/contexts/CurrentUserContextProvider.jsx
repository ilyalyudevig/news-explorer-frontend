import { useState, useEffect } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import * as auth from "../utils/auth";
import { api } from "../utils/api";
import { getToken, setToken, removeToken } from "../utils/token";

export function CurrentUserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState([]);
  const [keywords, setKeywords] = useState([]);

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

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const user = await auth.checkToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);

      const articles = await api.getSavedArticles(token);
      const reversedArticles = articles.reverse();
      setSavedArticles(reversedArticles);
      extractAndSetKeywords(reversedArticles);
    } catch {
      removeToken();
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (userData) => {
    const data = await auth.authorize(userData);
    if (!data.token) {
      throw new Error("No token received");
    }
    setToken(data.token);

    const user = await auth.checkToken(data.token);
    setCurrentUser(user);
    setIsLoggedIn(true);

    const token = getToken();
    const articles = await api.getSavedArticles(token);
    const reversedArticles = articles.reverse();
    setSavedArticles(reversedArticles);
    extractAndSetKeywords(reversedArticles);
  };

  const register = async (userData) => {
    return await auth.register(userData);
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    setSavedArticles([]);
    setKeywords([]);
  };

  const saveArticle = async (article) => {
    const token = getToken();
    const savedArticle = await api.saveArticle(article, token);
    setSavedArticles((prevArticles) => [savedArticle, ...prevArticles]);
    extractAndSetKeywords([savedArticle]);
    return savedArticle;
  };

  const deleteArticle = async (url) => {
    const token = getToken();
    const articleToDelete = savedArticles.find(
      (article) => article.url === url
    );
    await api.deleteArticle(articleToDelete._id, token);

    const updatedSavedArticles = savedArticles.filter(
      (article) => article._id !== articleToDelete._id
    );
    setSavedArticles(() => updatedSavedArticles.reverse());
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        authLoading,
        savedArticles,
        setSavedArticles,
        keywords,
        setKeywords,
        extractAndSetKeywords,
        login,
        register,
        logout,
        saveArticle,
        deleteArticle,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}