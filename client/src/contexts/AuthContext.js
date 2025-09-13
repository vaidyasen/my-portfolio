import React, { useState, useContext, createContext } from "react";
import axios from "axios";

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
    const savedToken = localStorage.getItem("admin_token");
    console.log("Initial token from localStorage:", savedToken);
    return savedToken;
  });

  const login = async (username, password) => {
    try {
      console.log("Attempting login with:", { username, password }); // Debug log
      const response = await axios.post("/auth/login", {
        username,
        password,
      });

      console.log("Login response:", response.data); // Debug log

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("admin_token", newToken);

      // Set default auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      console.log("Login successful! Token set:", newToken); // Debug log
      return { success: true };
    } catch (error) {
      console.error("Login error:", error); // Debug log
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = () => {
    return !!token;
  };

  // Set auth header if token exists
  React.useEffect(() => {
    console.log("AuthContext useEffect - token:", token);
    if (token) {
      console.log("Setting auth header with token:", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("No token found, removing auth header");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Initialize on mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    console.log("Checking for saved token on mount:", savedToken);
    if (savedToken && !token) {
      console.log("Setting token from localStorage:", savedToken);
      setToken(savedToken);
    }
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
