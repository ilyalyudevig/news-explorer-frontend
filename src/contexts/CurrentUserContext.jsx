import { createContext } from "react";

export const CurrentUserContext = createContext({
  isLoggedIn: false,
  currentUser: {},
  authLoading: true,
  apiLoading: false,
  isLoading: true, // Backward compatibility
  error: null,
  savedArticles: [],
  keywords: [],
  login: () => {},
  register: () => {},
  logout: () => {},
  saveArticle: () => {},
  deleteArticle: () => {},
});
