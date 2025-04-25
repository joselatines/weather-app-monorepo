import { FC, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <div className="search-container d-flex justify-content-center my-4">
      <input 
        type="text" 
        placeholder="Search for a city..."
        className="search-input"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
      
        onClick={() => onSearch(query)}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
