import { useState } from "react";
import config from "../config";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");

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
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return { isLoggedIn, authError, signup, login, logout, setAuthError };
}
