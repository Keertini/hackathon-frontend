import React, { useState } from "react";
import config from "./config";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Error:", error);
      setResponse("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gemini LLM Prompt</h1>

      <form onSubmit={handleSubmit} className="mb-6">
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
    </div>
  );
}

export default App;
