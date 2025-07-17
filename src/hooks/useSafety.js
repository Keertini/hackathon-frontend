import { useEffect, useRef, useState } from "react";

const useSafety = () => {
  const [seatbeltOn, setSeatbeltOn] = useState(false);
  const [alertOn, setAlertOn] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const playAlert = () => {
    if (!alertOn) {
      const audio = new Audio("/seatbelt-alert.mp3");
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
      setAlertOn(true);
    }
  };

  const stopAlert = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAlertOn(false);
  };

  const updateSeatbelt = (isFastened) => {
    setSeatbeltOn(isFastened);
    // No DB update anymore
  };

  const handleSeatbeltClick = () => {
    const newStatus = !seatbeltOn;
    if (newStatus) stopAlert(); // stop audio if seatbelt is fastened
    updateSeatbelt(newStatus);
  };

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (!seatbeltOn) {
      timerRef.current = setTimeout(() => {
        playAlert();
      }, 30000);
    }

    return () => clearTimeout(timerRef.current);
  }, [seatbeltOn]);

  return { seatbeltOn, alertOn, handleSeatbeltClick };
};

export default useSafety;
