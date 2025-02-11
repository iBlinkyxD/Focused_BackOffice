import { createContext, useState, useMemo, useEffect } from "react";
import { logIn } from "../services/AuthService";
import { getUserID } from "../services/UserService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState("");
  const [userID, setUserID] = useState(null);
  const [professionID, setProfessionID] = useState("");
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem("sessionToken");
      if (storedToken) {
        setSessionToken(storedToken);

        try {
          // Fetch user data using the stored token
          const data = await getUserID(storedToken);
          setUserID(data.id);
          setProfessionID(data.character_id);
          setUserEmail(data.email);
          setRole(
            data.id_rol === 0
              ? "Administrator"
              : data.id_rol === 2
              ? "Psychologist"
              : data.id_rol === 3
              ? "Psychiatrist"
              : ""
          );
        } catch (error) {
          console.error("Error fetching user data:", error);
          logOut();  // Optional: log out if data fetching fails
        }
      }
      setLoading(false);  // Finish loading after fetching user data
    };

    initializeAuth();
  }, []);

  const signIn = async (username, password) => {
    try {
      const data = await logIn(username, password);
      setSessionToken(data.access_token);
      sessionStorage.setItem("sessionToken", data.access_token);

      const data2 = await getUserID(data.access_token);

      if (data2.id_rol === 1) {
        throw new Error("Access denied: Role not allowed.");
      }

      setUserID(data2.id);
      setProfessionID(data2.character_id);
      setRole(
        data2.id_rol === 0
          ? "Administrator"
          : data2.id_rol === 2
          ? "Psychologist"
          : data2.id_rol === 3
          ? "Psychiatrist"
          : ""
      );
      setUserEmail(data2.email);
    } catch (error) {
      throw error;
    }
  };

  const logOut = () => {
    setSessionToken("");
    setUserID(null);
    setProfessionID("");
    setRole("");
    setUserEmail(null);
    sessionStorage.removeItem("sessionToken");
  };

  const contextValue = useMemo(() => {
    return {
      sessionToken,
      userID,
      professionID,
      role,
      userEmail,
      signIn,
      logOut,
      loading,
    };
  }, [sessionToken, userID, professionID, role, userEmail, loading]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
