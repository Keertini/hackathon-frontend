import { useEffect, useState } from "react";

const useForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async (lat, lon) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/weather/forecast?lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        if (response.ok) {
          const forecastArray = Object.entries(data).map(([date, info]) => ({
            date,
            ...info,
          }));
          setForecast(forecastArray);
        } else {
          console.error("Forecast error:", data);
        }
      } catch (err) {
        console.error("Forecast fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchForecast(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        console.warn("Geolocation not available for forecast.");
        setLoading(false);
      }
    );
  }, []);

  return { forecast, loading };
};

export default useForecast;
