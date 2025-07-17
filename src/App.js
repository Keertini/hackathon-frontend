import React, { useState } from "react";
import useAuth from "./hooks/useAuth";
import usePrompt from "./hooks/usePrompt";
import useSpeech from "./hooks/useSpeech";
import useHistory from "./hooks/useHistory";
import AuthForm from "./components/AuthForm";
import PromptForm from "./components/PromptForm";
import ResponseBox from "./components/ResponseBox";
import Dashboard from "./components/Dashboard";

function App() {
  const { isLoggedIn, authError, username, signup, login, logout, userId} = useAuth();
  const { loading, response, setResponse, submitPrompt } = usePrompt();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini");
  const [language, setLanguage] = useState("en-US");
  const { isRecording, isAudioPlaying, startRecording, readAloud } = useSpeech(language);
  const {
    history,
    loading: historyLoading,
    error: historyError,
    refresh,
  } = useHistory(username);

  return (
    <div className="App h-screen">
      {!isLoggedIn ? (
        <div className="m-auto w-full max-w-sm p-4">
          <AuthForm onSignup={signup} onLogin={login} error={authError} />
        </div>
      ) : (
        <div className="flex h-full w-full overflow-hidden">
          
          {/* Left Sidebar - History */}
          <aside className="w-1/3 min-w-[280px] max-w-[360px] border-r p-4 overflow-y-auto bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">History</h2>
              <button
                onClick={() => {
                  logout();
                  setPrompt("");
                  setResponse("");
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

          {/* Center - Prompt + Response */}
          <main className="flex-grow p-6 overflow-y-auto bg-white">
            <h1 className="text-3xl font-bold mb-4">LLM Prompt</h1>
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
                refresh();
              }}
              onRecord={() => startRecording(setPrompt)}
              onRead={() => readAloud(response)}
              isRecording={isRecording}
              isAudioPlaying={isAudioPlaying}
              loading={loading}
            />
            <ResponseBox response={response} />
          </main>

          {/* Right - Operator Dashboard */}

          <Dashboard userId={userId}/>
        </div>
      )}
    </div>
  );
}

export default App;
