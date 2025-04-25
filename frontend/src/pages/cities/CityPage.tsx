import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../lib/config';

interface WeatherData {
  data: {
    location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime: string;
    };
    current: {
      temp_c: number;
      temp_f: number;
      is_day: number;
      condition: {
        text: string;
        icon: string;
      };
      wind_kph: number;
      wind_mph: number;
      wind_dir: string;
      pressure_mb: number;
      humidity: number;
      cloud: number;
      feelslike_c: number;
      feelslike_f: number;
      vis_km: number;
      uv: number;
      gust_kph: number;
      last_updated: string;
    };
  };
}

const CityPage = () => {
  const { name } = useParams();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/weather?city=${name}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!data.data) {
          setError(data.message);
          return;
        }
        setWeather(data);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch weather data: error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [name]);

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger text-center mt-5">
      {error}
    </div>
  );

  if (!weather) return null;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  {weather.data.location.name}, {weather.data.location.country}
                </h2>
                <span className="badge bg-light text-dark">
                  {weather.data.location.localtime}
                </span>
              </div>
              <small className="text-white-50">
                {weather.data.location.region} | {weather.data.location.lat}, {weather.data.location.lon}
              </small>
            </div>
            
            {/* Current Weather */}
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4 text-center">
                  <img 
                    src={`https:${weather.data.current.condition.icon}`} 
                    alt={weather.data.current.condition.text} 
                    className="img-fluid"
                    style={{ width: '100px' }}
                  />
                  <h4>{weather.data.current.condition.text}</h4>
                </div>
                
                <div className="col-md-8">
                  <div className="display-3">
                    {weather.data.current.temp_c}°C
                    <small className="text-muted ms-2">
                      (Feels like {weather.data.current.feelslike_c}°C)
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Wind</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Speed:</strong> {weather.data.current.wind_kph} km/h ({weather.data.current.wind_mph} mph)</p>
                  <p className="mb-1"><strong>Direction:</strong> {weather.data.current.wind_dir}</p>
                  <p className="mb-0"><strong>Gusts:</strong> {weather.data.current.gust_kph} km/h</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Atmosphere</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Pressure:</strong> {weather.data.current.pressure_mb} mb</p>
                  <p className="mb-1"><strong>Humidity:</strong> {weather.data.current.humidity}%</p>
                  <p className="mb-0"><strong>Cloud Cover:</strong> {weather.data.current.cloud}%</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Visibility</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Distance:</strong> {weather.data.current.vis_km} km</p>
                  <p className="mb-1"><strong>UV Index:</strong> {weather.data.current.uv}</p>
                  <p className="mb-0"><strong>Last Updated:</strong> {weather.data.current.last_updated}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Location Details</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Timezone:</strong> {weather.data.location.tz_id}</p>
                  <p className="mb-1"><strong>Coordinates:</strong> {weather.data.location.lat}, {weather.data.location.lon}</p>
                  <p className="mb-0"><strong>Local Time:</strong> {weather.data.location.localtime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;