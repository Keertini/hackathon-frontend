import { useState } from "react";
import config from "../config";

export default function usePrompt() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const submitPrompt = async (prompt, model) => {
    setLoading(true);
    setResponse("");
    const endpoint =
      model === "cohere"
        ? `${config.API_BASE_URL}/api/cohere`
        : `${config.API_BASE_URL}/api/gemini`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response || "No response received.");
    setLoading(false);
  };

  return { loading, response, submitPrompt, setResponse };
}
