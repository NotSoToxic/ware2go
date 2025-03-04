import React, { useState } from 'react';
import CONFIG from '../config'; // Updated import

function WarehouseRequestForm({ onSubmit }) {
  const [request, setRequest] = useState({
    material: '',
    quantity: '',
    location: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Request Materials</h2>
      <input
        type="text"
        placeholder="Material Name"
        value={request.material}
        onChange={(e) => setRequest({ ...request, material: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={request.quantity}
        onChange={(e) => setRequest({ ...request, quantity: e.target.value })}
        required
      />
      <select
        value={request.location}
        onChange={(e) => setRequest({ ...request, location: e.target.value })}
        required
      >
        <option value="">Select Warehouse</option>
        {CONFIG.DEFAULT_WAREHOUSES.map((wh, index) => (
          <option key={index} value={wh.name}>{wh.name}</option>
        ))}
      </select>
      <button type="submit">Submit Request</button>
    </form>
  );
}

export default WarehouseRequestForm;
