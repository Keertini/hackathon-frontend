import { useState, useEffect } from "react";
import config from "../config";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [authError, setAuthError] = useState("");
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
  }, [isLoggedIn, username, userId]);

  const signup = async (username, password) => {
    setAuthError("");
    const res = await fetch(`${config.API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Signup failed");

    // Auto login after successful signup
    await login(username, password);
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
      setUsername(data.username);
      setUserId(data.user_id);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserId("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  return {
    isLoggedIn,
    authError,
    signup,
    login,
    logout,
    username,
    userId,
    setAuthError,
  };
}
