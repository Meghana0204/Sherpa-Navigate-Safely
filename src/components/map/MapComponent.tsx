import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  Autocomplete,
  HeatmapLayer,
  InfoWindow, // ⬅️ NEW
} from "@react-google-maps/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation } from "lucide-react";
import { CrimeIncident } from "@/types/incidents";
import { mockIncidents } from "@/data/mockData";
import MapControls from "./MapControls";

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

  // ⭐ NEW: address popup state
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  /** -----------------------
   * REVERSE GEOCODE (lat,lng -> address)
   ------------------------ */
  const fetchAddressForLocation = (lat: number, lng: number) => {
    if (!googleReady || !window.google) return;

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          setUserAddress(results[0].formatted_address);
          setShowUserInfo(true);
        } else {
          console.error("Geocoder failed:", status);
          setUserAddress("Address not found");
          setShowUserInfo(true);
        }
      }
    );
  };

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

            // Prepare Geocoder
            if (window.google) {
              geocoderRef.current = new window.google.maps.Geocoder();
            }

            // ⭐ ADD GOOGLE-STYLE "MY LOCATION" BUTTON
            const locationButton = document.createElement("button");
            locationButton.style.backgroundColor = "#fff";
            locationButton.style.border = "none";
            locationButton.style.outline = "none";
            locationButton.style.width = "40px";
            locationButton.style.height = "40px";
            locationButton.style.borderRadius = "50%";
            locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
            locationButton.style.cursor = "pointer";
            locationButton.style.padding = "0";
            locationButton.style.marginRight = "10px";

            locationButton.innerHTML = `
              <img 
                src="src/components/images/blue dot.png"
                style="width: 22px; height: 22px; margin: 9px;" 
              />
            `;

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
              locationButton
            );

            locationButton.addEventListener("click", () => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const position = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  };

                  setUserLocation(position);
                  setMapCenter(position);
                  map.panTo(position);
                  map.setZoom(16);
                });
              }
            });
          }}
          onClick={handleMapClick}
        >
          {/* HEATMAP */}
          {googleReady && <HeatmapLayer data={heatmapPoints} />}

          {/* USER LOCATION + POPUP ADDRESS */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
              onClick={() =>
                fetchAddressForLocation(userLocation.lat, userLocation.lng)
              }
            >
              {showUserInfo && userAddress && (
                <InfoWindow
                  position={userLocation}
                  onCloseClick={() => setShowUserInfo(false)}
                >
                  <div style={{ maxWidth: "260px" }}>
                    <h3 style={{ fontWeight: 600, marginBottom: 4 }}>
                      Your Location
                    </h3>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.3 }}>
                      {userAddress}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        userAddress
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.8rem",
                        textDecoration: "underline",
                        display: "inline-block",
                        marginTop: 4,
                      }}
                    >
                      View on Google Maps
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
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

        <MapControls mapRef={mapRef} />

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
      </LoadScript>
    </div>
  );
};

export default MapComponent;
