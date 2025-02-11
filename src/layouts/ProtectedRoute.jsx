import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { sessionToken, loading, role } = useContext(AuthContext);
  
  if (loading) {
    return null; // Or a loading spinner
  }

  if (!sessionToken || role === "Administrator") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;