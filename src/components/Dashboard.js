import React, { useEffect, useState } from "react";
import config from "../config";
import IncidentLog from "./IncidentLog";
import MachineBehavior from "./MachineBehavior";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Scheduled: "bg-gray-100 text-gray-800",
};

// ✅ Provide your specific machine IDs here
const YOUR_MACHINE_IDS = ["MACH001", "MACH007", "MACH016", "MACH010"];

const Dashboard = ({ userId, language, isRecording, startRecording }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${config.API_BASE_URL}/api/dashboard/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTasks(data.tasks);
        else console.error(data.error);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleStatus = async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : "Pending";

    const res = await fetch(`${config.API_BASE_URL}/api/dashboard/${userId}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    const data = await res.json();
    if (data.success) {
      setTasks((prev) =>
        prev.map((t) => (t.task_id === taskId ? { ...t, status: nextStatus } : t))
      );
    }
  };

  return (
    <aside className="w-1/4 min-w-[260px] max-w-[320px] border-l p-4 overflow-y-auto bg-gray-100">
      <h2 className="text-xl font-bold mb-4">📋 Assigned Tasks</h2>
      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {tasks.map((task) => (
            <div key={task.task_id} className="bg-white shadow p-3 rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-500">⏰ {task.time}</p>
                  <p className={`text-sm mt-1 px-2 py-1 inline-block rounded ${statusColors[task.status] || ""}`}>
                    {task.status}
                  </p>
                </div>
                <button
                  onClick={() => toggleStatus(task.task_id, task.status)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INCIDENT LOG */}
      <IncidentLog
        userId={userId}
        language={language}
        isRecording={isRecording}
        startRecording={startRecording}
      />

      {/* MACHINE BEHAVIOR MONITORING */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">🛠️ Machine Behavior</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {YOUR_MACHINE_IDS.map((id) => (
            <button
              key={id}
              className={`px-2 py-1 rounded border ${
                selectedMachineId === id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => setSelectedMachineId(id)}
            >
              {id}
            </button>
          ))}
        </div>

        {selectedMachineId && (
          <MachineBehavior machineId={selectedMachineId} />
        )}
      </div>
    </aside>
  );
};

export default Dashboard;
