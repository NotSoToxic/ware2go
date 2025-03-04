import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Create a singleton loader instance
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker']
});

function RouteMap({ route }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Load the Google Maps API
        const google = await loader.load();

        // Calculate center point for the map
        const points = route.route.map(segment => {
          const [lat, lng] = segment.from.match(/\(([^)]+)\)/)[1].split(',').map(coord => parseFloat(coord));
          return { lat, lng };
        });
        points.push({
          lat: parseFloat(route.route[0].to.match(/\(([^)]+)\)/)[1].split(',')[0]),
          lng: parseFloat(route.route[0].to.match(/\(([^)]+)\)/)[1].split(',')[1])
        });

        const bounds = new google.maps.LatLngBounds();
        points.forEach(point => bounds.extend(point));

        // Initialize the map
        const map = new google.maps.Map(mapRef.current, {
          center: bounds.getCenter(),
          zoom: 8,
          mapId: 'YOUR_MAP_ID' // Optional: Add your custom map ID if you have one
        });

        map.fitBounds(bounds);
        mapInstanceRef.current = map;

        // Clear existing markers and polyline
        markersRef.current.forEach(marker => marker.map = null);
        markersRef.current = [];
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        // Create markers for each point
        points.forEach((point, index) => {
          const marker = new google.maps.Marker({
            map,
            position: point,
            title: index === 0 ? 'Warehouse' : 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: index === 0 ? '#28a745' : '#dc3545',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });
          markersRef.current.push(marker);
        });

        // Draw route line
        const path = points.map(point => new google.maps.LatLng(point.lat, point.lng));
        const polyline = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#007bff',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map
        });
        polylineRef.current = polyline;

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    if (route && route.route) {
      initMap();
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.map = null);
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [route]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
}

export default RouteMap; 