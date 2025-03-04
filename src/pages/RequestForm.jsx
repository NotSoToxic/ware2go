import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../config/config.js';

function RequestForm() {
  const [request, setRequest] = useState({
    material: '',
    quantity: '',
    location: ''
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const materials = ["Steel", "Cement", "Wood"];

  // Get unique cities from warehouse locations
  const availableCities = [...new Set(CONFIG.DEFAULT_WAREHOUSES.map(warehouse => 
    warehouse.name.split(' ')[0]
  ))];

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setRequest(prev => ({ ...prev, location: value }));
    
    if (value.length > 0) {
      const suggestions = availableCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setRequest(prev => ({ ...prev, location: city }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("requestData", JSON.stringify(request));
    navigate("/results");
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-input-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="request-form-container">
      <h2>Request Materials</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="material">Material Type</label>
          <select
            id="material"
            value={request.material}
            onChange={(e) => setRequest({ ...request, material: e.target.value })}
            required
          >
            <option value="">Select Material</option>
            {materials.map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity (units)</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={request.quantity}
            onChange={(e) => setRequest({ ...request, quantity: e.target.value })}
            required
          />
        </div>

        <div className="form-group location-input-container">
          <label htmlFor="location">Your Location</label>
          <input
            id="location"
            type="text"
            placeholder="Enter your city (e.g., Delhi, Mumbai)"
            value={request.location}
            onChange={handleLocationChange}
            required
            autoComplete="off"
          />
          {showSuggestions && locationSuggestions.length > 0 && (
            <div className="location-suggestions">
              {locationSuggestions.map((city) => (
                <div
                  key={city}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit">Find Available Warehouses</button>
      </form>
    </div>
  );
}

export default RequestForm;
