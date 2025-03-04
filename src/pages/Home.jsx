import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages.css"; // Updated path for consistency

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Ware2Go</h1>
      <p>Your smart Multi-Warehouse Procurement & Route Optimization System.</p>

      <div className="home-buttons">
        <button onClick={() => navigate("/request")}>Request Materials</button>
        <button onClick={() => navigate("/results")}>View Requests</button>
      </div>
    </div>
  );
}

export default Home;
