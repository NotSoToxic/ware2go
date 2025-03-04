import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import CONFIG from '../config';

const mapStyles = { height: "400px", width: "100%" };

function MapComponent({ location }) {
  const mapCenter = location || { lat: 28.6139, lng: 77.2090 }; // Default: Delhi

  return (
    <LoadScript googleMapsApiKey={CONFIG.GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={mapCenter}>
        <Marker position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
