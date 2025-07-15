import React, { useState } from "react";
import config from "./config";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Signup successful! Please log in.");
      } else {
        setAuthError(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Error connecting to server.");
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setAuthError(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Error connecting to server.");
    }
  };

  // Prompt Submission Handler
  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
      } else if (data.error) {
        setResponse("Error: " + data.error);
      } else {
        setResponse("Unknown error occurred.");
      }
    } catch (error) {
      console.error("Prompt error:", error);
      setResponse("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setPrompt("");
    setResponse("");
    setAuthError("");
  };

  return (
    <div className="App p-8 max-w-xl mx-auto">
      {!isLoggedIn ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Sign Up / Login</h1>

          <form onSubmit={handleSignup} className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              className="w-full p-2 border mb-2"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full p-2 border mb-2"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Sign Up
            </button>
          </form>

          <form onSubmit={handleLogin} className="mb-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Log In
            </button>
          </form>

          {authError && <p className="text-red-600">{authError}</p>}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Gemini LLM Prompt</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>

          <form onSubmit={handleSubmitPrompt} className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows="4"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Generating..." : "Submit Prompt"}
            </button>
          </form>

          {response && (
            <div className="border p-4 rounded bg-gray-100">
              <h2 className="text-xl font-semibold mb-2">Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
