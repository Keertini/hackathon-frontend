import { useEffect, useRef, useState } from "react";

const useSafety = (username, machineId) => {
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

  const updateSeatbelt = async (isFastened, alert = false) => {
    setSeatbeltOn(isFastened);

    // Alert logic handled by useEffect
    await fetch("/api/security/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        machine_id: machineId,
        seatbelt: isFastened,
        safety_alert_triggered: alert,
      }),
    });
  };

  const handleSeatbeltClick = () => {
    const newStatus = !seatbeltOn;
    if (newStatus) stopAlert(); // Stop alert if fastening
    updateSeatbelt(newStatus, false);
  };

  // ⏱️ TIMER WATCHER: Trigger when seatbelt is OFF
  useEffect(() => {
    if (!username) return;

    // Clear existing timer if any
    clearTimeout(timerRef.current);

    if (!seatbeltOn) {
      timerRef.current = setTimeout(() => {
        playAlert();
        updateSeatbelt(false, true); // Still not fastened, trigger alert in DB
      }, 30000);
    }

    return () => clearTimeout(timerRef.current);
  }, [seatbeltOn]); // re-run if seatbelt is unfastened

  return { seatbeltOn, alertOn, handleSeatbeltClick };
};

export default useSafety;
