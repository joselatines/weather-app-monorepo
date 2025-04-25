import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import WeatherDisplay from "../../components/WeatherDisplay";
import RecentSearches from "../../components/RecentSearches";
import Favorites from "../../components/Favorites";
import { WeatherData } from "../../types/weather";
import { API_BASE_URL, BEARER_TOKEN, SEARCH_HISTORY_KEY } from "../../lib/config";
import { validateCityName } from "../../lib/utils/strings";

function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);


  // Save to localStorage when searches change
  const saveSearchIntoLocalStorage = (city: string) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase())
    ];

    setRecentSearches(updatedSearches);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedSearches));

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
  
      const response = await fetch(`${API_BASE_URL}/weather?city=${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
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
      console.log({error})
      setError('Unable to fetch weather data, try again.');
    }
  }

  return (
    <div className="container-fluid" style={{ width: '100vw' }}>
      <div className="row justify-content-center">
        <div className="col col-lg-auto ">
         <WeatherDisplay weather={weather} />
          <SearchBar onSearch={handleSubmitSearch} />
          {error && <div className="error-message text-danger">{error}</div>}
        </div>

        <div className="col col-lg-auto">

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

        <div>
         
        </div>
      </div>
    </div>
  );
}


export default HomePage
