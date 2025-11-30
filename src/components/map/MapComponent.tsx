import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  Autocomplete,
  HeatmapLayer
} from "@react-google-maps/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation } from "lucide-react";
import { CrimeIncident } from "@/types/incidents";
import { mockIncidents } from "@/data/mockData";

interface MapComponentProps {
  height?: string;
  showControls?: boolean;
  incidents?: CrimeIncident[];
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Colors for severity markers
const severityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent = ({
  height = "h-screen",
  showControls = true,
  incidents = mockIncidents,
  onLocationSelect,
}: MapComponentProps) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;
  const mapRef = useRef<google.maps.Map | null>(null);

  // State
  const [mapCenter, setMapCenter] = useState({ lat: 12.9800, lng: 77.5920 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number } | null>(null);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // 🌐 Handle Search
  const handleSearch = () => {
    if (!autoCompleteRef.current) return;

    const place = autoCompleteRef.current.getPlace();
    if (!place || !place.geometry) {
      alert("No location found!");
      return;
    }

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    setSearchMarker({ lat, lng });
    setMapCenter({ lat, lng });

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  };

  // 📍 Handle map click
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (onLocationSelect) onLocationSelect(lat, lng);
  };

  // 🔵 Locate user
  const handleFindMe = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });

        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );
  };

  // 🔥 Heatmap points
  const heatmapPoints = incidents.map((i) => {
    const weight =
      i.severity === "high" ? 1.0 : i.severity === "medium" ? 0.6 : 0.3;
    return { location: new google.maps.LatLng(i.lat, i.lng), weight };
  });

  return (
    <div className={`relative ${height} w-full`}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["places", "visualization"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          onLoad={(map) => (mapRef.current = map)}
          onClick={handleMapClick}
        >
          {/* 🔥 Heatmap */}
          <HeatmapLayer
            data={heatmapPoints}
            options={{
              radius: 25,
              opacity: 0.8,
            }}
          />

          {/* 📍 User Location */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* 🔎 Search marker */}
          {searchMarker && <Marker position={searchMarker} />}

          {/* 🟢 Incident markers */}
          {incidents.map((incident, index) => (
            <Circle
              key={index}
              center={{ lat: incident.lat, lng: incident.lng }}
              radius={120}
              options={{
                fillColor: severityColors[incident.severity],
                fillOpacity: 0.5,
                strokeColor: severityColors[incident.severity],
                strokeWeight: 1,
              }}
            />
          ))}
        </GoogleMap>

        {/* 🔍 Search Input */}
        <div className="absolute top-4 right-4 z-[1001] bg-background/80 backdrop-blur-sm p-2 rounded-md flex gap-2">
          <Autocomplete
            onLoad={(ac) => (autoCompleteRef.current = ac)}
            onPlaceChanged={handleSearch}
          >
            <Input
              className="w-64 bg-background/80"
              placeholder="Search location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Autocomplete>

          <Button size="icon" variant="outline" onClick={handleSearch}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* 📍 Find Me Button */}
        <Button
          className="absolute bottom-20 right-4 z-[1001] bg-background/80 backdrop-blur-sm"
          size="icon"
          variant="outline"
          onClick={handleFindMe}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
