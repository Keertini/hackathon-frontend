import { useEffect, useState, useRef, useCallback } from "react";

const useProximity = () => {
  const [distance, setDistance] = useState(10.0);
  const [alert, setAlert] = useState(false);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  const playAlert = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/proximity-alert.mp3");
      audio.play();
      audioRef.current = audio;

      // Stop audio after 2 seconds
      timeoutRef.current = setTimeout(() => {
        stopAlert();
      }, 2000);
    }
    setAlert(true);
  }, []);

  const stopAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // rewind to start
      audioRef.current = null;
    }
    clearTimeout(timeoutRef.current);
    setAlert(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomDistance = parseFloat((Math.random() * 10).toFixed(2));
      setDistance(randomDistance);

      if (randomDistance < 5) {
        playAlert();
      } else {
        stopAlert();
      }
    }, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
      stopAlert();
    };
  }, [playAlert, stopAlert]);

  return { distance, alert };
};

export default useProximity;
