import React, { useEffect, useState } from "react";
import config from "../config";

const IncidentLog = ({ userId, language, isRecording, startRecording }) => {
  const [incident, setIncident] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  const fetchIncidents = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/incidents/${userId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.incidents)) {
        const valid = data.incidents.filter((i) => i?.text);
        setIncidents(valid); // ✅ include ALL valid incidents including first
      } else {
        setError(data.error || "Could not fetch incidents.");
        setIncidents([]);
      }
    } catch (err) {
      setError("Failed to fetch incidents.");
      setIncidents([]);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [userId]);

  const handleSubmit = async () => {
    setError("");
    if (!incident.trim()) return;

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: incident }),
      });

      const data = await res.json();
      if (data.success && data.incident?.text) {
        setIncident("");
        fetchIncidents(); // ✅ refetch all incidents including newly added
      } else {
        setError(data.error || "Submission failed");
      }
    } catch (err) {
      setError("Submission error");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">📒 Incident Log</h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Describe the incident..."
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        {incidents.length === 0 ? (
          <p className="text-gray-500 col-span-2">No incidents found.</p>
        ) : (
          incidents.map((inc, index) => (
            <div
              key={inc._id || index}
              className="bg-white p-3 border rounded shadow text-sm"
            >
              <p className="mb-1">{inc.text || "⚠️ Missing content"}</p>
              <p className="text-gray-500 text-xs">
                {inc.created_at
                  ? new Date(inc.created_at).toLocaleString()
                  : "Unknown time"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentLog;
