import { FC, useState } from 'react';
import { WeatherData } from '../types/weather';
import {Link} from 'react-router-dom';
interface WeatherDisplayProps {
  weather: WeatherData | null;

}

const WeatherDisplay: FC<WeatherDisplayProps> = ({ weather }) => {
   const [unit, setUnit] = useState<'C' | 'F'>('C');

   if (!weather) return <div className="text-center d-flex justify-content-center align-items-center mx-auto" >Please search for a city</div>
  console.log({weather})
  const displayTemp = unit === 'C' ? weather.temperature_c : weather.temperature_f;
  const displayWind = unit === 'C' ? `${weather.wind_kph} km/h` : `${weather.wind_mph} mph`;

  const onUnitToggle = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  return (
    <div className="card shadow-sm mx-auto position-relative" style={{ maxWidth: '500px' }}>
     
    
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-0">{weather.city}</h2>
            <p className="mb-0 small">{weather.country}</p>
          </div>
    
          <div>
            <Link className='mr-3 btn btn-light btn-sm' to={`/cities/${weather.city}`}>See more</Link>
            <button 
              className="btn btn-light btn-sm ml-2"
              onClick={onUnitToggle}
              aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
            >
              °{unit === 'C' ? 'F' : 'C'}
            </button>
          </div>
       
        </div>
      </div>
      
      <div className="card-body">
        <div className="row align-items-center mb-4">
          <div className="col-4 text-center">
            <img 
              src={weather.icon} 
              alt={weather.condition} 
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
            <p className="mt-2 mb-0 fw-medium">{weather.condition}</p>
          </div>
          
          <div className="col-8">
            <div className="display-4">
              {displayTemp}°{unit}
            </div>
          </div>
        </div>
        
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Wind</h5>
                <p className="card-text fs-5">{displayWind}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Humidity</h5>
                <p className="card-text fs-5">{weather.humidity}%</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Local Time</h5>
                <p className="card-text fs-5">{weather.localTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;