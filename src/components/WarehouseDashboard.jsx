import React, { useState } from 'react';
import CONFIG from '../config/config.js';

function WarehouseDashboard() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [inventory, setInventory] = useState({});

  const warehouses = CONFIG.DEFAULT_WAREHOUSES;

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setInventory(warehouse.inventory);
  };

  const handleInventoryUpdate = (material, quantity) => {
    setInventory(prev => ({
      ...prev,
      [material]: parseInt(quantity)
    }));
  };

  return (
    <div className="warehouse-dashboard">
      <h2>Warehouse Dashboard</h2>
      
      <div className="warehouse-selector">
        <h3>Select Your Warehouse</h3>
        <select 
          onChange={(e) => handleWarehouseSelect(warehouses.find(w => w.id === e.target.value))}
          value={selectedWarehouse?.id || ''}
        >
          <option value="">Select a warehouse</option>
          {warehouses.map(warehouse => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      {selectedWarehouse && (
        <div className="warehouse-details">
          <h3>Warehouse Details</h3>
          <div className="info-card">
            <p><strong>Location:</strong> {selectedWarehouse.name}</p>
            <p><strong>Transport Options:</strong> {selectedWarehouse.transportOptions.join(', ')}</p>
          </div>

          <h3>Inventory Management</h3>
          <div className="inventory-management">
            {Object.entries(inventory).map(([material, quantity]) => (
              <div key={material} className="inventory-item">
                <label>{material}</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleInventoryUpdate(material, e.target.value)}
                  min="0"
                />
                <span>units</span>
              </div>
            ))}
          </div>

          <div className="warehouse-actions">
            <button className="update-inventory">Update Inventory</button>
            <button className="view-requests">View Requests</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WarehouseDashboard; 