import React, { useEffect, useState } from 'react';
import CONFIG from '../config/config.js';
import RouteMap from './RouteMap';

function RouteOptimizer({ requestData }) {
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOptimizedRoute() {
      if (!requestData) {
        console.log('Missing request data');
        return;
      }

      const requestBody = {
        location: requestData.location,
        material: requestData.material,
        quantity: parseInt(requestData.quantity),
        warehouses: CONFIG.DEFAULT_WAREHOUSES
      };

      console.log('Sending request with data:', requestBody);

      try {
        const response = await fetch('http://localhost:5000/api/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to fetch route');
        }

        setRoute(responseData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching optimized route:", err);
      }
    }

    fetchOptimizedRoute();
  }, [requestData]);

  return (
    <div className="route-optimizer">
      {error ? (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      ) : route ? (
        <div className="route-details">
          <div className="route-map">
            <RouteMap route={route} />
          </div>
          
          <div className="route-summary">
            <h3>Route Summary</h3>
            <div className="summary-item">
              <p><strong>Total Distance:</strong> {Math.round(route.distance / 1000)} km</p>
              <p><strong>Total Duration:</strong> {Math.round(route.duration / 3600)} hours</p>
              <p><strong>Total Cost:</strong> ₹{route.totalCost.toLocaleString()}</p>
              <p><strong>Optimization Score:</strong> {(route.score * 100).toFixed(1)}%</p>
            </div>

            <h3>Selected Warehouse</h3>
            <div className="warehouse-info">
              <p><strong>Name:</strong> {route.selectedWarehouse.name}</p>
              <p><strong>Available Inventory:</strong> {route.selectedWarehouse.inventory[requestData.material]} units</p>
              <p><strong>Transport Options:</strong> {route.selectedWarehouse.transportOptions.join(', ')}</p>
            </div>
            
            <h3>Delivery Route</h3>
            {route.route.map((segment, index) => (
              <div key={index} className="route-segment">
                <p><strong>From Warehouse:</strong> {segment.from}</p>
                <p><strong>To Your Location:</strong> {segment.to}</p>
                <p><strong>Distance:</strong> {segment.distance.text}</p>
                <p><strong>Duration:</strong> {segment.duration.text}</p>
                <p><strong>Transport Mode:</strong> {segment.transportMode}</p>
                <p><strong>Cost:</strong> ₹{segment.cost.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="loading">
          <p>Finding best available warehouse...</p>
        </div>
      )}
    </div>
  );
}

export default RouteOptimizer;
