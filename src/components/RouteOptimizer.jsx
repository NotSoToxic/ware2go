import React, { useEffect, useState } from 'react';
import { CONFIG } from '../config/config.js'; // Updated import

function RouteOptimizer({ requestData, warehouses }) {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    async function fetchOptimizedRoute() {
      try {
        const response = await fetch('https://api.gemini.com/optimize-route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.GEMINI_API_KEY}`,
          },
          body: JSON.stringify({ requestData, warehouses }),
        });

        const data = await response.json();
        setRoute(data.optimizedRoute);
      } catch (error) {
        console.error("Error fetching optimized route:", error);
      }
    }

    if (requestData) {
      fetchOptimizedRoute();
    }
  }, [requestData, warehouses]);

  return (
    <div>
      <h2>Optimized Route</h2>
      {route ? <p>{JSON.stringify(route)}</p> : <p>Loading...</p>}
    </div>
  );
}

export default RouteOptimizer;
