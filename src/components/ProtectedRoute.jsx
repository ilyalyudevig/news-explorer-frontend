import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function ProtectedRoute({ children, handleSigninModalOpen }) {
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      console.log(isLoggedIn);
      navigate("/", { replace: true });
      handleSigninModalOpen();
    }
  }, [isLoggedIn]);

  return children;
}

export default ProtectedRoute;
