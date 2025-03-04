const CONFIG = {
    DEFAULT_WAREHOUSES: [
      { 
        id: "DEL",
        lat: 28.7041, 
        lng: 77.1025, 
        name: "Delhi Warehouse",
        inventory: {
          "Steel": 1000,
          "Cement": 2000,
          "Wood": 500
        },
        transportOptions: ["truck", "train"]
      },
      { 
        id: "MUM",
        lat: 19.076, 
        lng: 72.8777, 
        name: "Mumbai Warehouse",
        inventory: {
          "Steel": 800,
          "Cement": 1500,
          "Wood": 300
        },
        transportOptions: ["truck", "train", "ship"]
      },
      { 
        id: "KOL",
        lat: 22.5726, 
        lng: 88.3639, 
        name: "Kolkata Warehouse",
        inventory: {
          "Steel": 1200,
          "Cement": 1800,
          "Wood": 400
        },
        transportOptions: ["truck", "train", "ship"]
      },
      {
        id: "LKO",
        lat: 26.8467,
        lng: 80.9462,
        name: "Lucknow Warehouse",
        inventory: {
          "Steel": 500,
          "Cement": 1000,
          "Wood": 200
        },
        transportOptions: ["truck", "train"]
      },
      {
        id: "GWL",
        lat: 26.2183,
        lng: 78.1828,
        name: "Gwalior Warehouse",
        inventory: {
          "Steel": 600,
          "Cement": 1200,
          "Wood": 250
        },
        transportOptions: ["truck", "train"]
      },
      {
        id: "AGR",
        lat: 27.1767,
        lng: 78.0081,
        name: "Agra Warehouse",
        inventory: {
          "Steel": 400,
          "Cement": 800,
          "Wood": 150
        },
        transportOptions: ["truck", "train"]
      }
    ],
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    TRANSPORT_COSTS: {
      truck: {
        baseCost: 1000,
        perKm: 2.5,
        maxDistance: 1000,
        speed: 60
      },
      train: {
        baseCost: 5000,
        perKm: 1.5,
        maxDistance: 2000,
        speed: 80
      },
      ship: {
        baseCost: 8000,
        perKm: 1.0,
        maxDistance: 5000,
        speed: 40
      }
    }
  };
  
  export default CONFIG;
  