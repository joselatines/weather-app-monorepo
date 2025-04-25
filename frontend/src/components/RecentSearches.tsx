import { useEffect } from 'react';
import { SEARCH_HISTORY_KEY } from '../lib/config';

interface RecentSearchesProps {
  handleSubmitSearch: (city: string) => void;
  recentSearches: string[];
  setRecentSearches: (searches: string[]) => void;
}
const RecentSearches = ({ handleSubmitSearch , recentSearches, setRecentSearches}: RecentSearchesProps) => {

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedSearches = localStorage.getItem(`${SEARCH_HISTORY_KEY}_${token}`);
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);


  const handleRecentSearchClick = (city: string) => {
    handleSubmitSearch(city);
  };

  const clearSearches = () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem(`${SEARCH_HISTORY_KEY}_${token}`);
    setRecentSearches([]);
  }

  return (
    <div className="recent-searches mb-4">
      <h3>Recent Searches</h3>
      {recentSearches.length > 0 ? (
        <div className='d-flex flex-wrap'>
          {recentSearches.map((city, index) => (
            <span 
              key={index}
              onClick={() => handleRecentSearchClick(city)}
              className="border rounded p-2 mr-3 cursor-pointer hover:bg-gray-200"
              style={{cursor: 'pointer'}}
            >
              {city}
            </span>
          ))}
        </div>
      ) : (
        <p>No recent searches</p>
      )}
   
      <button onClick={clearSearches} className="btn btn-secondary mt-4">Clear searches</button>
  
    </div>
  );
};

export default RecentSearches;
