import { useState, useEffect, useCallback } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import * as auth from "../utils/auth";
import { api } from "../utils/api";
import { getToken, setToken, removeToken } from "../utils/token";

export function CurrentUserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const withAsyncHandler = useCallback(
    async (asyncFn, loadingSetter = setApiLoading) => {
      loadingSetter(true);
      setError(null);
      try {
        return await asyncFn();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        loadingSetter(false);
      }
    },
    []
  );

  const clearUserState = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setSavedArticles([]);
    setKeywords([]);
    removeToken();
  }, []);

  const extractKeywords = useCallback((articles) => {
    return articles
      .map((article) => article.keywords)
      .flat()
      .filter(Boolean)
      .filter((keyword, index, self) => self.indexOf(keyword) === index);
  }, []);

  const updateKeywords = useCallback(
    (newArticles) => {
      const newKeywords = extractKeywords(newArticles);
      setKeywords((prev) => [
        ...prev,
        ...newKeywords.filter((keyword) => !prev.includes(keyword)),
      ]);
    },
    [extractKeywords]
  );

  const loadSavedArticles = useCallback(
    async (token) => {
      const articles = await api.getSavedArticles(token);
      const sortedArticles = [...articles].reverse();
      setSavedArticles(sortedArticles);
      updateKeywords(sortedArticles);
    },
    [updateKeywords]
  );

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    await withAsyncHandler(async () => {
      const user = await auth.checkToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);
      await loadSavedArticles(token);
    }, setAuthLoading);
  }, [withAsyncHandler, loadSavedArticles]);

  const login = useCallback(
    async (userData) => {
      await withAsyncHandler(async () => {
        const data = await auth.authorize(userData);
        if (!data.token) {
          throw new Error("No token received");
        }
        setToken(data.token);

        const user = await auth.checkToken(data.token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        await loadSavedArticles(data.token);
      });
    },
    [withAsyncHandler, loadSavedArticles]
  );

  const register = useCallback(
    async (userData) => {
      return await withAsyncHandler(async () => {
        return await auth.register(userData);
      });
    },
    [withAsyncHandler]
  );

  const logout = useCallback(() => {
    clearUserState();
    setError(null);
    setApiLoading(false);
    setAuthLoading(false);
  }, [clearUserState]);

  const saveArticle = useCallback(
    async (article) => {
      return await withAsyncHandler(async () => {
        const token = getToken();
        if (!token) throw new Error("No token available");

        const savedArticle = await api.saveArticle(article, token);
        setSavedArticles((prev) => [savedArticle, ...prev]);
        updateKeywords([savedArticle]);
        return savedArticle;
      });
    },
    [withAsyncHandler, updateKeywords]
  );

  const deleteArticle = useCallback(
    async (url) => {
      await withAsyncHandler(
        async () => {
          const token = getToken();
          if (!token) throw new Error("No token available");

          const articleToDelete = savedArticles.find(
            (article) => article.url === url
          );
          if (!articleToDelete) throw new Error("Article not found");

          await api.deleteArticle(articleToDelete._id, token);

          setSavedArticles((prev) => {
            const updatedArticles = prev.filter(
              (article) => article._id !== articleToDelete._id
            );
            const newKeywords = extractKeywords(updatedArticles);
            setKeywords(newKeywords);
            return updatedArticles;
          });
        },
        () => {} // no-op loading setter to suppress the Preloader on delete article call
      );
    },
    [withAsyncHandler, savedArticles, extractKeywords]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextValue = {
    isLoggedIn,
    currentUser,
    authLoading,
    apiLoading,
    isLoading: authLoading || apiLoading,
    error,
    savedArticles,
    keywords,
    setKeywords,
    login,
    register,
    logout,
    saveArticle,
    deleteArticle,
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
}
