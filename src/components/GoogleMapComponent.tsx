"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const MapComponent = () => {
  const position: LatLngExpression = [18.5204, 73.8567];

  return (
    <MapContainer
      // @ts-ignore: MapContainerProps in v5 has strict internal definitions
      center={position}
      zoom={50}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>KrishiMitra Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;


// w-full border border-alert-red p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start md:gap-4