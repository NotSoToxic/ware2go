import React, { useEffect } from "react";
import { GOOGLE_MAPS_API_KEY } from "../config/config";

function MapView({ warehouses }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = function () {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 },
      });

      warehouses.forEach((warehouse) => {
        new window.google.maps.Marker({
          position: { lat: warehouse.lat, lng: warehouse.lng },
          map,
          title: warehouse.name,
        });
      });
    };
  }, [warehouses]);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
}

export default MapView;
