import { useState, useEffect, useCallback } from "react";
import config from "../config";

export default function useHistory(username) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/history/${username}`);
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || "Failed to fetch history.");
      }
    } catch (err) {
      console.error("History fetch failed:", err);
      setError("Network error while fetching history.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refresh: fetchHistory };
}
