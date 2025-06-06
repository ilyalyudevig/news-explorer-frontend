import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import Preloader from "./Preloader";

function ProtectedRoute({ children, handleSigninModalOpen }) {
  const { isLoggedIn, authLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/", { replace: true });
      handleSigninModalOpen();
    }
  }, [isLoggedIn, authLoading, navigate, handleSigninModalOpen]);

  if (authLoading) {
    return <Preloader text="Loading..." />;
  }

  return children;
}

export default ProtectedRoute;
