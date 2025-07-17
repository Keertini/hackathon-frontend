import React, { useEffect, useState } from "react";
import config from "../config";

const MachineBehavior = ({ machineId }) => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!machineId) return;
    fetch(`${config.API_BASE_URL}/api/behavior/${machineId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlerts(data.alerts);
        } else {
          setError(data.error || "Failed to fetch behavior");
        }
      })
      .catch(() => setError("Network error"));
  }, [machineId]);

  return (
    <div className="p-4 mt-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">🧠 Machine Behavior Alerts</h3>
      {error && <p className="text-red-500">{error}</p>}
      {alerts.length === 0 ? (
        <p className="text-gray-600">✅ No abnormal behavior detected.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {alerts.map((alert, idx) => (
            <li key={idx}>{alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MachineBehavior;
