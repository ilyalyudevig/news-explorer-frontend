import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function ProtectedRoute({ children, handleSigninModalOpen }) {
  const { isLoggedIn } = useContext(CurrentUserContext);

  if (!isLoggedIn) {
    handleSigninModalOpen();
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
