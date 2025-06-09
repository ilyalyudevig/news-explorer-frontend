import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import Preloader from "./Preloader";

function ProtectedRoute({ children, handleSigninModalOpen }) {
  const { isLoggedIn, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/", { replace: true });
      handleSigninModalOpen();
    }
  }, [handleSigninModalOpen, isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return <Preloader text="Loading..." />;
  }

  return children;
}

export default ProtectedRoute;
