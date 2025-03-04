import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Better naming for server-side environment variable
const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

// Log API key status (safely)
console.log('API Key loaded:', GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');
console.log('API Key prefix:', GOOGLE_MAPS_API_KEY ? GOOGLE_MAPS_API_KEY.substring(0, 10) + '...' : 'None');

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
  process.exit(1);
}

// Helper function to get coordinates from location name
async function getCoordinates(location) {
  try {
    console.log('Geocoding location:', location);
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    
    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    throw new Error(`Could not geocode location: ${location}`);
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Helper function to find warehouses with sufficient inventory
function findAvailableWarehouses(warehouses, material, quantity) {
  return warehouses.filter(warehouse => 
    warehouse.inventory[material] >= quantity
  );
}

// Helper function to calculate transport cost
function calculateTransportCost(distance, transportType) {
  const costs = {
    truck: { baseCost: 1000, perKm: 2.5, maxDistance: 1000, speed: 60 },
    train: { baseCost: 5000, perKm: 1.5, maxDistance: 2000, speed: 80 },
    ship: { baseCost: 8000, perKm: 1.0, maxDistance: 5000, speed: 40 }
  };

  const cost = costs[transportType];
  if (distance > cost.maxDistance) return Infinity;
  
  return cost.baseCost + (distance * cost.perKm);
}

// Helper function to find optimal transport mode
function findOptimalTransport(distance) {
  const costs = {
    truck: calculateTransportCost(distance, 'truck'),
    train: calculateTransportCost(distance, 'train'),
    ship: calculateTransportCost(distance, 'ship')
  };

  return Object.entries(costs)
    .sort(([,a], [,b]) => a - b)[0][0];
}

// Helper function to optimize warehouse route
function optimizeWarehouseRoute(destination, warehouses, material, quantity) {
  // Find warehouses with sufficient inventory
  const availableWarehouses = findAvailableWarehouses(warehouses, material, quantity);
  
  if (availableWarehouses.length === 0) {
    throw new Error('No warehouses have sufficient inventory');
  }

  // Calculate distances and costs for each warehouse
  const warehouseOptions = availableWarehouses.map(warehouse => {
    const distance = calculateDistance(
      warehouse.lat, warehouse.lng,
      destination.lat, destination.lng
    );

    // Find optimal transport mode for this distance
    const transportMode = findOptimalTransport(distance);
    const cost = calculateTransportCost(distance, transportMode);
    
    return {
      warehouse,
      distance,
      transportMode,
      cost,
      duration: (distance / transportMode.speed) * 3600 // Duration in seconds
    };
  });

  // Calculate a combined score for each warehouse option
  // Lower score is better (weighted combination of distance, cost, and duration)
  warehouseOptions.forEach(option => {
    const maxDistance = Math.max(...warehouseOptions.map(o => o.distance));
    const maxCost = Math.max(...warehouseOptions.map(o => o.cost));
    const maxDuration = Math.max(...warehouseOptions.map(o => o.duration));

    // Check if warehouse is in the same location (within 1km)
    const isSameLocation = option.distance < 1;

    option.score = (
      (option.distance / maxDistance) * 0.4 +  // 40% weight to distance
      (option.cost / maxCost) * 0.3 +         // 30% weight to cost
      (option.duration / maxDuration) * 0.3   // 30% weight to duration
    );

    // If warehouse is in the same location, give it a very low score
    if (isSameLocation) {
      option.score = 0.1;
    }
  });

  // Sort by combined score
  warehouseOptions.sort((a, b) => a.score - b.score);

  // Select the best warehouse
  const bestWarehouse = warehouseOptions[0];
  
  // Create route from warehouse to destination
  const route = [{
    from: `${bestWarehouse.warehouse.name} (${bestWarehouse.warehouse.lat},${bestWarehouse.warehouse.lng})`,
    to: `${destination.name} (${destination.lat},${destination.lng})`,
    distance: {
      value: Math.round(bestWarehouse.distance * 1000),
      text: `${Math.round(bestWarehouse.distance)} km`
    },
    duration: {
      value: Math.round(bestWarehouse.duration),
      text: `${Math.round(bestWarehouse.duration / 3600)} hours`
    },
    transportMode: bestWarehouse.transportMode,
    cost: bestWarehouse.cost
  }];

  return {
    route,
    totalDistance: route[0].distance.value,
    totalDuration: route[0].duration.value,
    totalCost: route[0].cost,
    selectedWarehouse: bestWarehouse.warehouse,
    score: bestWarehouse.score
  };
}

app.post('/api/route', async (req, res) => {
  console.log('Received request body:', req.body);
  const { location, material, quantity, warehouses } = req.body;

  if (!location || !material || !quantity) {
    console.log('Missing required data:', { location, material, quantity });
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    // Convert location name to coordinates
    const destinationCoords = await getCoordinates(location);

    console.log('Converted coordinates:', { destinationCoords });

    // Optimize warehouse route
    const result = optimizeWarehouseRoute(
      { ...destinationCoords, name: location },
      warehouses,
      material,
      quantity
    );

    res.json({
      route: result.route,
      summary: "Route calculated with optimal warehouse selection",
      distance: result.totalDistance,
      duration: result.totalDuration,
      totalCost: result.totalCost,
      selectedWarehouse: result.selectedWarehouse,
      score: result.score
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ error: error.message || "Server error while calculating route" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
