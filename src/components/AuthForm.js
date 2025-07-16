import React, { useState } from "react";

export default function AuthForm({ onSignup, onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sign Up / Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await onSignup(username, password);
            alert("Signup successful! Please log in.");
          } catch (err) {
            console.error(err);
          }
        }}
        className="mb-4"
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Sign Up
        </button>
      </form>
      <button
        onClick={async () => {
          try {
            await onLogin(username, password);
          } catch (err) {
            console.error(err);
          }
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Log In
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
