import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return AuthService.getToken();
  });

  const login = async (username, password) => {
    const result = await AuthService.login(username, password);

    if (result.success) {
      setToken(result.token);
      setUser(result.user);
      return { success: true };
    }

    return result;
  };

  const logout = async () => {
    const result = await AuthService.logout();
    setToken(null);
    setUser(null);
    return result;
  };

  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  // Initialize on mount
  useEffect(() => {
    const savedToken = AuthService.getToken();
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated,
    }),
    [user, token, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
