import React, { useState } from "react";
import useAuth from "./hooks/useAuth";
import usePrompt from "./hooks/usePrompt";
import useSpeech from "./hooks/useSpeech";
import useHistory from "./hooks/useHistory";
import useSafety from "./hooks/useSafety";
import useProximity from "./hooks/useProximity";
import useWeather from "./hooks/useWeather";
import useForecast from "./hooks/useForecast";
import useMLPrediction from "./hooks/useMLPrediction";
import AuthForm from "./components/AuthForm";
import PromptForm from "./components/PromptForm";
import ResponseBox from "./components/ResponseBox";
import Dashboard from "./components/Dashboard";

function App() {
  const { isLoggedIn, authError, username, signup, login, logout, userId } =
    useAuth();

  const { seatbeltOn, handleSeatbeltClick } = useSafety();
  const { distance, alert: proximityAlert } = useProximity();
  const { weather, loading: weatherLoading } = useWeather();
  const { forecast, loading: forecastLoading } = useForecast();
  const {
    result,
    predictTime,
    loading: mlLoading,
    error: mlError,
  } = useMLPrediction();
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

          {/* Center - Prompt + Safety + Weather */}
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            <h1 className="text-3xl font-bold mb-6" style="text-align: center;">
            {/* Safety Section */}
            <div className="mb-6 grid grid-cols-1 gap-4">
              {/* Seatbelt */}
              <div className="p-4 border rounded bg-yellow-100 flex justify-between items-center">
                <div>
                  <strong>Seatbelt Status:</strong>{" "}
                  {seatbeltOn ? "✅ Fastened" : "❌ Not Fastened"}
                </div>
                <button
                  onClick={handleSeatbeltClick}
                  className={`w-44 py-2 rounded text-white text-sm font-medium ${
                    seatbeltOn ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {seatbeltOn ? "Unfasten Seatbelt" : "Fasten Seatbelt"}
                </button>
              </div>

              {/* Proximity */}
              <div
                className={`p-4 border rounded flex justify-between items-center ${
                  proximityAlert ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <div>
                  <strong>Proximity:</strong>{" "}
                  {distance ? `${distance} meters` : "Loading..."}{" "}
                  {proximityAlert ? "🚨 DANGER!" : "✅ Safe"}
                </div>
                <div className="w-44" />
              </div>

              {/* Weather */}
              <div
                className={`p-6 border-2 rounded-lg ${
                  weather?.insight?.includes("⛔") ||
                  weather?.insight?.includes("🚨")
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}
              >
                <strong className="text-lg">Weather Insight:</strong>{" "}
                {weatherLoading ? (
                  <p>Loading...</p>
                ) : weather ? (
                  <p className="mb-3">
                    {weather.insight} ({weather.temperature}°C, Wind:{" "}
                    {weather.wind_speed} km/h)
                  </p>
                ) : (
                  "Unavailable"
                )}
                <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
                {forecastLoading ? (
                  <p>Loading forecast...</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {forecast.map((day) => (
                      <div
                        key={day.date}
                        className="p-3 border rounded bg-white shadow-sm text-sm"
                      >
                        <p className="font-medium">{day.date}</p>
                        <p>{day.description}</p>
                        <p>
                          {day.temperature}°C, Wind: {day.wind_speed} km/h
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Input */}
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

            {/* Response Output */}
            <ResponseBox response={response} />
            <div className="my-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">
                🧠 ML Task Time Estimator
              </h2>
              <button
                onClick={predictTime}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Generate & Predict
              </button>

              {mlLoading && <p className="mt-2">🔄 Predicting...</p>}
              {mlError && <p className="mt-2 text-red-500">{mlError}</p>}

              {result && (
                <div className="mt-4 text-sm text-gray-800">
                  <p>
                    For the conditions: <br />
                    <strong>Engine Hours:</strong> {result.input.engine_hours}{" "}
                    hrs, <strong>Fuel Used:</strong> {result.input.fuel_used} L,
                    <br />
                    <strong>Load Cycles:</strong> {result.input.load_cycles},{" "}
                    <strong>Temperature:</strong> {result.input.temperature}°C,{" "}
                    <strong>Wind Speed:</strong> {result.input.wind_speed} km/h,{" "}
                    <strong>Humidity:</strong> {result.input.humidity}%
                  </p>
                  <p className="mt-2 font-semibold text-green-700">
                    → Predicted Task Completion Time:{" "}
                    {result.predicted_task_time} hours
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Dashboard */}
          <Dashboard userId={userId} />
        </div>
      )}
    </div>
  );
}

export default App;
