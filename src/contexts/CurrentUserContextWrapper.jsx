import { CurrentUserContext } from "./CurrentUserContext";
import { useState, useEffect } from "react";

import { getToken } from "../utils/token";
import { useApiCall } from "../hooks/useApiCall";

import * as auth from "../utils/auth";

function CurrentUserContextWrapper({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const { execute } = useApiCall();

  const setUser = (user) => {
    if (user) {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    execute(auth.checkToken, token).then((user) => {
      setCurrentUser(user);
    });
    // This effect only needs to run once on the first render, and execute, auth, setCurrentUser, and setIsLoggedIn are not expected to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(currentUser);
  return (
    <CurrentUserContext.Provider
      value={{ isLoggedIn: Boolean(currentUser), currentUser, setUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
export default CurrentUserContextWrapper;
