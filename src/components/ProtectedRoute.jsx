import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function ProtectedRoute({ children, handleSigninModalOpen }) {
  const { isLoggedIn } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      handleSigninModalOpen();
    }
  });

  return children;
}

export default ProtectedRoute;
