import React, { useState } from "react";
import useAuth from "./hooks/useAuth";
import usePrompt from "./hooks/usePrompt";
import useSpeech from "./hooks/useSpeech";
import AuthForm from "./components/AuthForm";
import PromptForm from "./components/PromptForm";
import ResponseBox from "./components/ResponseBox";

function App() {
  const { isLoggedIn, authError, signup, login, logout } = useAuth();
  const { loading, response, submitPrompt } = usePrompt();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini");
  const [language, setLanguage] = useState("en-US");
  const { isRecording, isAudioPlaying, startRecording, readAloud } =
    useSpeech(language);

  return (
    <div className="App p-8 max-w-xl mx-auto">
      {!isLoggedIn ? (
        <AuthForm onSignup={signup} onLogin={login} error={authError} />
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <h1 className="text-3xl font-bold">LLM Prompt</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
          <PromptForm
            model={model}
            setModel={setModel}
            language={language}
            setLanguage={setLanguage}
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={(e) => {
              e.preventDefault();
              submitPrompt(prompt, model);
            }}
            onRecord={() => startRecording(setPrompt)}
            onRead={() => readAloud(response)}
            isRecording={isRecording}
            isAudioPlaying={isAudioPlaying}
            loading={loading}
          />
          <ResponseBox response={response} />
        </>
      )}
    </div>
  );
}

export default App;
