import React from "react";
import { languageOptions } from "../utils/languageOptions";

export default function PromptForm({
  prompt,
  setPrompt,
  model,
  setModel,
  language,
  setLanguage,
  onSubmit,
  onRecord,
  onRead,
  isRecording,
  isAudioPlaying,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      {/* 1. Model Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="gemini">Gemini</option>
          <option value="cohere">Cohere</option>
        </select>
      </div>

      {/* 2. Language Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Prompt Textarea */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Prompt:</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded"
          rows="4"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* 4. Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRecord}
          className={`px-4 py-2 rounded ${
            isRecording
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {isRecording ? "Recording..." : "🎤 Record"}
        </button>

        <button
          type="button"
          onClick={onRead}
          className={`px-4 py-2 rounded ${
            isAudioPlaying
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {isAudioPlaying ? "⏹️ Stop" : "🔊 Read Aloud"}
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
