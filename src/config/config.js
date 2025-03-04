const CONFIG = {
    DEFAULT_WAREHOUSES: [
      { lat: 28.7041, lng: 77.1025, name: "Delhi Warehouse" },
      { lat: 19.076, lng: 72.8777, name: "Mumbai Warehouse" },
      { lat: 22.5726, lng: 88.3639, name: "Kolkata Warehouse" },
    ],
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  };
  
  export default CONFIG;
  