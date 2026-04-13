import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent({ setLocation }) {

  const [position, setPosition] = useState(null);

  function LocationMarker() {

    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLocation(e.latlng);
      },
    });

    return position ? (
      <Marker position={position} icon={DefaultIcon}>
        <Popup>
          <div className="text-sm font-medium text-emerald-600">
            Selected Location
          </div>
          <div className="text-gray-700 text-xs mt-1">
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
        </Popup>
      </Marker>
    ) : null;
  }

  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords);
        setLocation(coords);

      },

      () => console.log("Location access denied")

    );

  }, []);

  return (

    <div className="rounded-xl overflow-hidden border border-emerald-300 shadow-sm">

      <MapContainer
        center={position || [20, 77]}
        zoom={position ? 13 : 5}
        style={{ height: "320px", width: "100%" }}
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationMarker />

      </MapContainer>

    </div>

  );
}