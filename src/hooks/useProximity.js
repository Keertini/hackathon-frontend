import { useEffect, useState, useRef, useCallback } from "react";

const useProximity = () => {
  const [distance, setDistance] = useState(10.0);
  const [alert, setAlert] = useState(false);
  const audioRef = useRef(null);

  const playAlert = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/proximity-alert.mp3");
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
    }
    setAlert(true);
  }, []);

  const stopAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
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
    }, 5000);

    return () => clearInterval(interval);
  }, [playAlert, stopAlert]);

  return { distance, alert };
};

export default useProximity;
