import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Better naming for server-side environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing. Please set GOOGLE_MAPS_API_KEY in your .env file.');
  process.exit(1);
}

app.post('/api/route', async (req, res) => {
  const { origin, destination, warehouses = [] } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Missing origin or destination." });
  }

  // Handle case when warehouses is undefined or not an array
  const waypointsString = Array.isArray(warehouses) && warehouses.length > 0
    ? warehouses
        .filter(wh => wh && wh.lat && wh.lng) // Ensure valid waypoints
        .map(wh => `via:${wh.lat},${wh.lng}`)
        .join('|')
    : '';

  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
    key: GOOGLE_MAPS_API_KEY
  });
  
  if (waypointsString) {
    queryParams.append('waypoints', waypointsString);
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Google Maps API returned status ${response.status}` 
      });
    }
    
    const data = await response.json();

    if (data.status === "OK") {
      res.json({
        route: data.routes[0],
        summary: data.routes[0].summary,
        distance: data.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0),
        duration: data.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0)
      });
    } else {
      res.status(400).json({ 
        error: data.error_message || `Google Maps API error: ${data.status}`,
        status: data.status
      });
    }
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ error: "Server error while calculating route" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
