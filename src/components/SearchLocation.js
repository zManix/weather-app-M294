import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function SearchLocation({ 
  onSearch, 
  favorites, 
  onFavoriteSelect, 
  currentLocation, 
  isFavorite, 
  onToggleFavorite 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const API_KEY = 'd06b69e7931340c485b111410250605';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
        (searchRef.current && !searchRef.current.contains(event.target))
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
          params: {
            key: API_KEY,
            q: searchTerm
          }
        });
        
        setSearchResults(response.data);
        // Only show dropdown if we have results or favorites
        setShowDropdown(response.data.length > 0 || favorites.length > 0);
      } catch (error) {
        console.error("Error searching locations:", error);
        setSearchResults([]);
      }
      setLoading(false);
    };

    // Debounce the search
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchLocations();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowDropdown(false);
    }
  };

  const handleLocationSelect = (location) => {
    onSearch(location.name);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleFavoriteClick = (location) => {
    onFavoriteSelect(location);
    setShowDropdown(false);
  };

  const isFavorited = (locationName) => {
    return favorites.includes(locationName);
  };

  return (
    <div className="search-container-wrapper">
      <form className="search-container" onSubmit={handleSubmit} ref={searchRef}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim() && setShowDropdown(true)}
        />
        <button type="submit">Search</button>
        <button 
          type="button" 
          className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <button 
          type="button" 
          className="favorites-dropdown-button" 
          onClick={() => setShowDropdown(!showDropdown)}
          title="View favorites"
        >
          ▼
        </button>
      </form>

      {showDropdown && (
        <div className="search-dropdown" ref={dropdownRef}>
          {loading ? (
            <div className="search-loading">Loading locations...</div>
          ) : (
            <>
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Search Results</h4>
                  <ul>
                    {searchResults.map((location, index) => (
                      <li 
                        key={`search-${index}`} 
                        onClick={() => handleLocationSelect(location)}
                        className="search-item"
                      >
                        <span>{location.name}, {location.country}</span>
                        {isFavorited(location.name) && (
                          <span className="favorite-star">★</span>
                        )}
                        {!isFavorited(location.name) && (
                          <span className="empty-star">☆</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {favorites.length > 0 && (
                <div className="favorites-list">
                  <h4>Favorites</h4>
                  <ul>
                    {favorites.map((location, index) => (
                      <li 
                        key={`favorite-${index}`} 
                        onClick={() => handleFavoriteClick(location)}
                        className="favorite-item"
                      >
                        <span>{location}</span>
                        <span className="favorite-star">★</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchResults.length === 0 && favorites.length === 0 && (
                <div className="no-results">
                  No locations found. Try a different search term.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchLocation;