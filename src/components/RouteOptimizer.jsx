import React, { useEffect, useState } from 'react';
import CONFIG from '../config/config.js';

function RouteOptimizer({ requestData, warehouses }) {
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOptimizedRoute() {
      if (!requestData || !warehouses.length) return;

      const waypointsString = warehouses
        .map(wh => `via:${wh.lat},${wh.lng}`)
        .join('|');

      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${requestData.origin}&destination=${requestData.destination}&waypoints=${waypointsString}&key=${CONFIG}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "OK") {
          setRoute(data.routes[0]); // Extract the first optimal route
        } else {
          throw new Error(data.error_message || "Failed to fetch route");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching optimized route:", err);
      }
    }

    fetchOptimizedRoute();
  }, [requestData, warehouses]);

  return (
    <div>
      <h2>Optimized Route</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : route ? (
        <pre>{JSON.stringify(route, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RouteOptimizer;
