import { FC, useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/config';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length > 2) { // Only fetch after 3 characters
      const fetchSuggestions = async () => {
        try {
        const token = localStorage.getItem("token");

          const response = await fetch(`${API_BASE_URL}/weather/autocomplete?query=${query}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });
          const data = await response.json();

          if (data.error) {
            console.error(data.error);
            return;
          }

          const cities = data.data.map((item: { name: string }) => item.name);
          setSuggestions(cities);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      
      const debounceTimer = setTimeout(fetchSuggestions, 300); // Simple debounce
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="search-container position-relative d-flex justify-content-center my-4">
      <input 
        type="text" 
        placeholder="Search for a city..."
        className="search-input form-control"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <button 
        className="btn btn-primary ms-2"
        onClick={() => {
          onSearch(query);
          setShowSuggestions(false);
        }}
      >
        Search
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group position-absolute top-100 start-0 w-100 mt-1 z-3">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="list-group-item list-group-item-action"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;