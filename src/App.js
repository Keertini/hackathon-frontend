import React, { useState } from "react";
import useAuth from "./hooks/useAuth";
import usePrompt from "./hooks/usePrompt";
import useSpeech from "./hooks/useSpeech";
import useHistory from "./hooks/useHistory";
import useSafety from "./hooks/useSafety";
import useProximity from "./hooks/useProximity";
import AuthForm from "./components/AuthForm";
import PromptForm from "./components/PromptForm";
import ResponseBox from "./components/ResponseBox";

function App() {
  const { isLoggedIn, authError, username, signup, login, logout } = useAuth();
  const machineId = "MACH123";
  const { seatbeltOn, handleSeatbeltClick } = useSafety(username, machineId);
  const { loading, response, setResponse, submitPrompt } = usePrompt();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini");
  const [language, setLanguage] = useState("en-US");
  const { isRecording, isAudioPlaying, startRecording, readAloud } =
    useSpeech(language);
  const {
    history,
    loading: historyLoading,
    error: historyError,
    refresh,
  } = useHistory(username);
  const { distance, alert: proximityAlert } = useProximity(username, machineId);

  return (
    <div className="App flex h-screen">
      {!isLoggedIn ? (
        // If not logged in, show the Auth Form centered
        <div className="m-auto w-full max-w-sm p-4">
          <AuthForm onSignup={signup} onLogin={login} error={authError} />
        </div>
      ) : (
        <>
          {/* Sidebar */}
          <aside className="w-1/3 border-r p-4 overflow-y-auto bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">History</h2>
              <button
                onClick={() => {
                  logout();
                  setPrompt("");
                  setResponse("");
                  fetch("/api/security/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      username,
                      machine_id: machineId,
                      seatbelt: false,
                      safety_alert_triggered: false,
                    }),
                  });
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Log Out
              </button>
            </div>
            {historyLoading ? (
              <p>Loading...</p>
            ) : historyError ? (
              <p className="text-red-500">{historyError}</p>
            ) : (
              <ul className="space-y-4">
                {history.map((item) => (
                  <li
                    key={item._id}
                    className="border p-3 rounded bg-white shadow"
                  >
                    <p className="text-xs text-gray-600">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="font-medium truncate">📝 {item.prompt}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-4">LLM Prompt</h1>
            <div className="mb-4 p-4 border rounded bg-yellow-100 flex justify-between items-center">
              <div>
                <strong>Seatbelt Status:</strong>{" "}
                {seatbeltOn ? "✅ Fastened" : "❌ Not Fastened"}
              </div>
              <button
                onClick={handleSeatbeltClick}
                className={`px-4 py-2 rounded ${
                  seatbeltOn ? "bg-green-600" : "bg-red-600"
                } text-white`}
              >
                {seatbeltOn ? "Unfasten Seatbelt" : "Fasten Seatbelt"}
              </button>
              <div
                className={`mb-4 p-4 border rounded ${
                  proximityAlert ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <strong>Proximity:</strong>{" "}
                {distance ? `${distance} meters` : "Loading..."}{" "}
                {proximityAlert ? "🚨 DANGER!" : "✅ Safe"}
              </div>
            </div>
            <PromptForm
              model={model}
              setModel={setModel}
              language={language}
              setLanguage={setLanguage}
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={async (e) => {
                e.preventDefault();
                await submitPrompt(prompt, model, username, language);
                refresh(); // Refresh after saving
              }}
              onRecord={() => startRecording(setPrompt)}
              onRead={() => readAloud(response)}
              isRecording={isRecording}
              isAudioPlaying={isAudioPlaying}
              loading={loading}
            />
            <ResponseBox response={response} />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
