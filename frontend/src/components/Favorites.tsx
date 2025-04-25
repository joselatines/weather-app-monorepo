import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/config';
import { FaStar, FaTrashCan } from 'react-icons/fa6';

interface FavoritesProps {
  currentCity: string | null;
  onFavoriteClick: (city: string) => void;
}

const Favorites = ({ currentCity, onFavoriteClick }: FavoritesProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setFavorites(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = async (city: string) => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ city })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setFavorites(prev => [...prev, city]);
    } catch (err) {
      console.error(err);
      setError('Failed to add favorite');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (city: string) => {
    try {
      const token = localStorage.getItem("token");

      setLoading(true);
      await fetch(`${API_BASE_URL}/favorites/${encodeURIComponent(city)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFavorites(prev => prev.filter(fav => fav !== city));
    } catch (err) {
      console.error(err);
      setError('Failed to remove favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorites">
      <h3>Favorites</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      <ul>
        {favorites.map((city, index) => (
          <li key={index}>
            <span style={{ cursor: 'pointer' }} onClick={() => onFavoriteClick(city)}>{city}</span>
            <FaTrashCan cursor={'pointer'} size={15} className='text-danger' onClick={() => removeFavorite(city)} />
          </li>
        ))}
      </ul>

      {currentCity && !favorites.includes(currentCity) && (
        
        <button 
          onClick={() => addFavorite(currentCity)}
          disabled={loading}
        >
         Mark {currentCity} as Favorite <FaStar />
        </button>
      )}
    </div>
  );
};

export default Favorites;
