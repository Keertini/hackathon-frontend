import { useState } from "react";
import config from "../config";

export default function useMLPrediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictTime = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data); // includes input and predicted_task_time
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return { result, predictTime, loading, error };
}
