import { createContext } from "react";

export const CurrentUserContext = createContext({
  isLoggedIn: false,
  currentUser: {},
  authLoading: true,
  savedArticles: [],
  keywords: [],
  setKeywords: () => {},
  login: () => {},
  register: () => {},
  logout: () => {},
  saveArticle: () => {},
  deleteArticle: () => {},
});
