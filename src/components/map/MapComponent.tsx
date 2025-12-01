console.log("API KEY:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  Autocomplete,
  HeatmapLayer,
  InfoWindow,
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

const libraries: ("places" | "visualization")[] = ["places", "visualization"];

const MapComponent = ({
  height = "h-screen",
  showControls = true,
  incidents = mockIncidents,
  onLocationSelect,
}: MapComponentProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Global handler for Google Maps auth failure
    // @ts-ignore
    window.gm_authFailure = () => {
      console.error("Google Maps Authentication Error");
      alert(
        "Google Maps API Error: Please ensure your API key is valid and has 'Maps JavaScript API' and 'Places API' enabled in the Google Cloud Console. Billing must also be enabled."
      );
    };
    return () => {
      // @ts-ignore
      window.gm_authFailure = undefined;
    };
  }, []);

  const [googleReady, setGoogleReady] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.98, lng: 77.592 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number } | null>(null);

  const [userDisplayAddress, setUserDisplayAddress] = useState<string | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  /** -----------------------
   * FALLBACK GEOCODER (lat/lng -> generic address)
   ------------------------ */
  const reverseGeocodeLocation = (lat: number, lng: number) => {
    if (!googleReady || !window.google) {
      console.error("Google object not ready for Geocoder");
      return;
    }

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          setUserDisplayAddress(results[0].formatted_address);
          setShowUserInfo(true);
        } else {
          console.error("Geocoder failed due to:", status);
          setUserDisplayAddress("Address not found");
          setShowUserInfo(true);
        }
      }
    );
  };

  /** -----------------------
   * TRY NEARBY PLACES FIRST, THEN FALLBACK TO GEOCODER
   ------------------------ */
  const fetchPlaceOrAddressForLocation = (lat: number, lng: number) => {
    if (!googleReady || !window.google) {
      console.error("Google object not ready for PlacesService");
      return;
    }

    if (!placesServiceRef.current && mapRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        mapRef.current
      );
    }

    const service = placesServiceRef.current;

    if (!service) {
      reverseGeocodeLocation(lat, lng);
      return;
    }

    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 100, // meters
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const place = results[0];
          const name = place.name || "Nearby Place";
          const vicinity = place.vicinity || "";

          const display = vicinity ? `${name}, ${vicinity}` : name;

          setUserDisplayAddress(display);
          setShowUserInfo(true);
        } else {
          // If no nearby POI, fallback to generic address
          reverseGeocodeLocation(lat, lng);
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
   * - Move blue marker to clicked point
   * - Update address
   ------------------------ */
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const newLocation = { lat, lng };
    setUserLocation(newLocation);
    setMapCenter(newLocation);

    fetchPlaceOrAddressForLocation(lat, lng);

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

        const newLocation = { lat, lng };

        setUserLocation(newLocation);
        setMapCenter(newLocation);

        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
          mapRef.current.setZoom(15);
        }
        // We let user click/drag to refine, so no address fetch here.
      },
      (err) => {
        console.error("Location Error:", err);
        alert("Unable to fetch your location. Please allow location access.");
      },
      { enableHighAccuracy: true }
    );
  };

  /** -----------------------
   * AUTO-LOCATE ON MOUNT
   ------------------------ */
  useEffect(() => {
    handleFindMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** -----------------------
   * HEATMAP DATA
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
        libraries={libraries}
        onLoad={() => setGoogleReady(true)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
            setGoogleReady(true);

            if (window.google) {
              geocoderRef.current = new window.google.maps.Geocoder();
              placesServiceRef.current = new window.google.maps.places.PlacesService(
                map
              );
            }
          }}
          onClick={handleMapClick}
        >
          {/* HEATMAP */}
          {googleReady && <HeatmapLayer data={heatmapPoints} />}

          {/* USER LOCATION MARKER (DRAGGABLE + POPUP) */}
          {userLocation && (
            <Marker
              position={userLocation}
              draggable
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
              onClick={() => {
                fetchPlaceOrAddressForLocation(
                  userLocation.lat,
                  userLocation.lng
                );
              }}
              onDragEnd={(e) => {
                if (!e.latLng) return;
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();

                const newLocation = { lat, lng };
                setUserLocation(newLocation);
                setMapCenter(newLocation);

                fetchPlaceOrAddressForLocation(lat, lng);
                if (onLocationSelect) onLocationSelect(lat, lng);
              }}
            >
              {showUserInfo && userDisplayAddress && (
                <InfoWindow
                  position={userLocation}
                  onCloseClick={() => setShowUserInfo(false)}
                >
                  <div style={{ maxWidth: "260px" }}>
                    <h3 style={{ fontWeight: 600, marginBottom: 4 }}>
                      Your Location
                    </h3>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.3 }}>
                      {userDisplayAddress}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        userDisplayAddress
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
