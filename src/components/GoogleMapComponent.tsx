"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapComponentProps {
  latitude: number;
  longitude: number;
}
const MapComponent = ({ latitude, longitude }: MapComponentProps) => {
  if (latitude == null || longitude == null) {
    return <div className="flex items-center justify-center">Loading map...</div>;
  }
  const position: LatLngExpression = [latitude, longitude];
  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "500px", width: "100%", minHeight: "500px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;

// w-full border border-alert-red p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start md:gap-4
