import { useState, useRef } from "react";
import config from "../config";
import { gTTSLanguageMap } from "../utils/languageOptions";

export default function useSpeech(language) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  const startRecording = (setPrompt) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
  };

  const readAloud = async (text) => {
    if (isAudioPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      return;
    }

    const gttsLang = gTTSLanguageMap[language] || "en";
    const res = await fetch(
      `${config.API_BASE_URL}/api/tts?text=${encodeURIComponent(
        text
      )}&lang=${gttsLang}`
    );

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsAudioPlaying(true);
    audio.play();
    audio.onended = () => setIsAudioPlaying(false);
    audio.onpause = () => setIsAudioPlaying(false);
  };

  return { isRecording, isAudioPlaying, startRecording, readAloud };
}
