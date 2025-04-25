import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import WeatherDisplay from "../../components/WeatherDisplay";
import RecentSearches from "../../components/RecentSearches";
import Favorites from "../../components/Favorites";
import { WeatherData } from "../../types/weather";
import { API_BASE_URL, SEARCH_HISTORY_KEY } from "../../lib/config"; 
import { validateCityName } from "../../lib/utils/strings";
import { useNavigate } from "react-router-dom"; // Added for potential redirect on auth error

function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate(); // Added hook


  // Save to localStorage when searches change
  const saveSearchIntoLocalStorage = (city: string) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase())
    ];
    const token = localStorage.getItem("token");
    setRecentSearches(updatedSearches);
    localStorage.setItem(`${SEARCH_HISTORY_KEY}_${token}`, JSON.stringify(updatedSearches));

  };

  const handleSubmitSearch = async (city: string) => {
    try {
      setError('');
      if (!city) {
        setError('City is required');
        return;
      }

      const { isValid, error } = validateCityName(city);

      if (!isValid) {
        setError(error);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        // Optionally redirect to login
        // navigate("/login"); 
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/weather?city=${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Use token from localStorage
          'Authorization': `Bearer ${token}` 
        }
      });

  
     const data = await response.json();

      if (!data.data) return setError(data.message);
      console.log({data})
      const weatherData = data.data;

      // handle data
      setWeather({
        city: weatherData.location.name,
        country: weatherData.location.country,
        temperature_c: weatherData.current.temp_c,
        temperature_f: weatherData.current.temp_f,
        condition: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
        wind_kph: weatherData.current.wind_kph,
        wind_mph: weatherData.current.wind_mph,
        humidity: weatherData.current.humidity,
        localTime: weatherData.location.localtime
      })

      saveSearchIntoLocalStorage(city);
    } catch (error) {
      console.error("Fetch error:", error); // Log the actual error
      if (error instanceof Error && error.message.includes("Unauthorized")) { // Basic check for auth error
         setError('Session expired or invalid. Please log in again.');
         localStorage.removeItem("token"); // Clear invalid token
         navigate("/login"); // Redirect to login
      } else {
         setError('Unable to fetch weather data, try again.');
      }
    }
  }

  return (
  <div className="container-fluid px-3 px-md-4 px-lg-5" style={{ minHeight: '100vh' }}>
    <div className="row g-3 g-md-4">
      {/* Main Weather Column - takes full width on mobile, 7 cols on larger screens */}
      <div className="col-12 col-lg-7 order-1 order-lg-1">
        <div className="d-flex flex-column gap-3 gap-md-4">
          <SearchBar onSearch={handleSubmitSearch} />
          {error && <div className="alert alert-danger">{error}</div>}
          {weather && <WeatherDisplay weather={weather} />}
        </div>
      </div>

      {/* Sidebar Column - takes full width on mobile, 5 cols on larger screens */}
      <div className="col-12 col-lg-5 order-2 order-lg-2">
        <div className="d-flex flex-column gap-3 gap-md-4">
          <RecentSearches 
            handleSubmitSearch={handleSubmitSearch}
            recentSearches={recentSearches} 
            setRecentSearches={setRecentSearches}
          />
          <Favorites 
            currentCity={weather?.city || null}
            onFavoriteClick={handleSubmitSearch}
          />
        </div>
      </div>
    </div>
  </div>
  );
}


export default HomePage
