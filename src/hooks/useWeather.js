import { useEffect, useState } from "react";
import config from "../config";

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const url =
          lat && lon
            ? `${config.API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`
            : `${config.API_BASE_URL}/api/weather`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setWeather(data);
        } else {
          console.error("Weather fetch error:", data);
        }
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation failed, using default city.", error);
        fetchWeather(); // fallback to default (e.g., Chennai)
      }
    );
  }, []);

  return { weather, loading };
};

export default useWeather;
