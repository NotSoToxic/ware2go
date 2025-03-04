import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import RequestForm from "./pages/RequestForm.jsx";
import Results from "./pages/Results.jsx";
import config from "./config/config.js";
const CONFIG = config;
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
