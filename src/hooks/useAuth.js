import { useState, useEffect } from "react";
import config from "../config";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    // Initialize from localStorage
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [authError, setAuthError] = useState("");
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );

  useEffect(() => {
    // Keep localStorage updated whenever state changes
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("username", username);
  }, [isLoggedIn, username]);

  const signup = async (username, password) => {
    setAuthError("");
    const res = await fetch(`${config.API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Signup failed");
  };

  const login = async (username, password) => {
    setAuthError("");
    const res = await fetch(`${config.API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setIsLoggedIn(true);
      setUsername(username);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    // Clear storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  return {
    isLoggedIn,
    authError,
    signup,
    login,
    logout,
    username,
    setAuthError,
  };
}
