import React, { useEffect, useState } from 'react';
import CONFIG from '../config/config.js';
import RouteOptimizer from '../components/RouteOptimizer';

function Results() {
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("requestData");
    if (storedData) {
      setRequestData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div>
      <h2>Requested Materials</h2>
      {requestData ? (
        <div>
          <p><strong>Material:</strong> {requestData.material}</p>
          <p><strong>Quantity:</strong> {requestData.quantity}</p>
          <p><strong>Warehouse:</strong> {requestData.location}</p>
          <RouteOptimizer requestData={requestData} warehouses={CONFIG.DEFAULT_WAREHOUSES} />
        </div>
      ) : (
        <p>No request data found.</p>
      )}
    </div>
  );
}

export default Results;
