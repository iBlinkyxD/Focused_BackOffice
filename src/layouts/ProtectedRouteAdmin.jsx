import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const ProtectedRouteAdmin = ({ children }) => {
  const { sessionToken, loading, role } = useContext(AuthContext);
  
  if (loading) {
    return null; // Or a loading spinner
  }

  if (!sessionToken || role === "Psychologist" || role === "Psychiatrist") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouteAdmin;