import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import RequestForm from './pages/RequestForm';
import RouteOptimizer from './components/RouteOptimizer';
import WarehouseDashboard from './components/WarehouseDashboard';
import './pages.css';

function App() {
  const [userType, setUserType] = useState('user');

  return (
    <div className="app">
      <Navigation userType={userType} onUserTypeChange={setUserType} />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/request" 
            element={
              userType === 'user' ? (
                <RequestForm />
              ) : (
                <div className="error-message">
                  <p>Please switch to User Dashboard to request materials.</p>
                </div>
              )
            } 
          />
          <Route 
            path="/warehouse" 
            element={
              userType === 'warehouse' ? (
                <WarehouseDashboard />
              ) : (
                <div className="error-message">
                  <p>Please switch to Warehouse Dashboard to manage inventory.</p>
                </div>
              )
            } 
          />
          <Route 
            path="/results" 
            element={
              userType === 'user' ? (
                <RouteOptimizer 
                  requestData={JSON.parse(localStorage.getItem("requestData"))} 
                />
              ) : (
                <div className="error-message">
                  <p>Please switch to User Dashboard to view route results.</p>
                </div>
              )
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
