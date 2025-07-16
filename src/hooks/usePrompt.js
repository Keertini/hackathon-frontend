import { useState } from "react";
import config from "../config";

export default function usePrompt() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const submitPrompt = async (prompt, model, username, language) => {
    setLoading(true);
    setResponse("");

    const endpoint =
      model === "cohere"
        ? `${config.API_BASE_URL}/api/cohere`
        : `${config.API_BASE_URL}/api/gemini`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.response || "No response received.";
      setResponse(text);

      // Save history
      if (username) {
        await fetch(`${config.API_BASE_URL}/api/save_history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            prompt,
            response: text,
            language,
          }),
        });
      }
    } catch (err) {
      console.error("Prompt failed:", err);
      setResponse("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, submitPrompt, setResponse };
}
