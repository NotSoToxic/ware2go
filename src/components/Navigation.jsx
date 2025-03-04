import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ userType, onUserTypeChange }) {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">Ware2Go</Link>
      </div>
      
      <div className="nav-links">
        <div className="user-type-toggle">
          <button 
            className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
            onClick={() => onUserTypeChange('user')}
          >
            User Dashboard
          </button>
          <button 
            className={`toggle-btn ${userType === 'warehouse' ? 'active' : ''}`}
            onClick={() => onUserTypeChange('warehouse')}
          >
            Warehouse Dashboard
          </button>
        </div>

        {userType === 'user' ? (
          <Link 
            to="/request" 
            className={location.pathname === '/request' ? 'active' : ''}
          >
            Request Materials
          </Link>
        ) : (
          <Link 
            to="/warehouse" 
            className={location.pathname === '/warehouse' ? 'active' : ''}
          >
            Manage Inventory
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation; 