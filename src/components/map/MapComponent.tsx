console.log("API KEY:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  Autocomplete,
  HeatmapLayer,
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

const severityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const containerStyle = { width: "100%", height: "100%" };

const MapComponent = ({
  height = "h-screen",
  showControls = true,
  incidents = mockIncidents,
  onLocationSelect,
}: MapComponentProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<google.maps.Map | null>(null);

  const [googleReady, setGoogleReady] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.98, lng: 77.592 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number } | null>(null);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  /** -----------------------
   * SEARCH HANDLER
   ------------------------ */
  const handleSearch = () => {
    if (!autoCompleteRef.current) return;

    const place = autoCompleteRef.current.getPlace();
    if (!place || !place.geometry) {
      alert("No location found!");
      return;
    }

    const lat = place.geometry.location!.lat();
    const lng = place.geometry.location!.lng();

    setSearchMarker({ lat, lng });
    setMapCenter({ lat, lng });

    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(15);
  };

  /** -----------------------
   * MAP CLICK HANDLER
   ------------------------ */
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (onLocationSelect) onLocationSelect(lat, lng);
  };

  /** -----------------------
   * FIND USER LOCATION
   ------------------------ */
  const handleFindMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({ lat, lng });

        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
      },
      (err) => console.error("Location Error:", err),
      { enableHighAccuracy: true }
    );
  };

  /** -----------------------
   * HEATMAP DATA (SAFE VERSION)
   ------------------------ */
  const heatmapPoints =
    googleReady && window.google
      ? incidents.map((i) => ({
          location: new window.google.maps.LatLng(i.lat, i.lng),
          weight:
            i.severity === "high"
              ? 1.0
              : i.severity === "medium"
              ? 0.6
              : 0.3,
        }))
      : [];

  return (
    <div className={`relative ${height} w-full`}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["places", "visualization"]}
        onLoad={() => setGoogleReady(true)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
            setGoogleReady(true);
          }}
          onClick={handleMapClick}
        >
          {/* HEATMAP */}
          {googleReady && <HeatmapLayer data={heatmapPoints} />}

          {/* USER LOCATION */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* SEARCH MARKER */}
          {searchMarker && <Marker position={searchMarker} />}

          {/* INCIDENT MARKERS */}
          {googleReady &&
            incidents.map((incident, index) => (
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

        {/* SEARCH BAR */}
        <div className="absolute top-4 right-4 z-[1001] bg-background/80 backdrop-blur-sm p-2 rounded-md flex gap-2">
          <Autocomplete
            onLoad={(ac) => (autoCompleteRef.current = ac)}
            onPlaceChanged={handleSearch}
          >
            <Input
              placeholder="Search location"
              className="w-64 bg-background/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Autocomplete>

          <Button size="icon" variant="outline" onClick={handleSearch}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* FIND ME BUTTON */}
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
