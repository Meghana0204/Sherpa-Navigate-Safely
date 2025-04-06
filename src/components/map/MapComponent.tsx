import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation, X } from 'lucide-react';
import MapControls from './MapControls';
import { mockIncidents } from '@/data/mockData';
import { CrimeIncident } from '@/types/incidents';

// Fix for default marker icons in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define leaflet.heat module
declare global {
  interface Window {
    L: typeof L & {
      heatLayer?: (latlngs: any[], options?: any) => L.Layer;
    }
  }
}

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to find and zoom to user's current location
const LocationFinder = ({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) => {
  const map = useMap();
  
  const findLocation = () => {
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', (e) => {
      onLocationFound(e.latlng.lat, e.latlng.lng);
    });
    
    map.on('locationerror', (e) => {
      console.error('Error finding location:', e.message);
    });
  };
  
  return (
    <Button
      onClick={findLocation}
      className="absolute bottom-20 right-4 z-[1000] bg-background/80 backdrop-blur-sm hover:bg-background"
      size="icon"
      variant="outline"
    >
      <Navigation className="h-5 w-5" />
    </Button>
  );
};

// Component for heat map visualization
const HeatMapLayer = ({ incidents }: { incidents: CrimeIncident[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!incidents.length) return;
    
    // Create heatmap data points with weighted intensity based on severity
    const points = incidents.map(incident => {
      // Weight by severity: high (1.0), medium (0.6), low (0.3)
      const intensity = 
        incident.severity === 'high' ? 1.0 : 
        incident.severity === 'medium' ? 0.6 : 0.3;
      
      return [incident.lat, incident.lng, intensity];
    });
    
    if (window.L && window.L.heatLayer) {
      const heatLayer = window.L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: 'blue',
          0.4: 'lime',
          0.6: 'yellow',
          0.8: 'orange',
          1.0: 'red'
        }
      }).addTo(map);
      
      return () => {
        map.removeLayer(heatLayer);
      };
    } else {
      console.error('Leaflet heat plugin not loaded');
    }
  }, [incidents, map]);
  
  return null;
};

// Search component
const SearchControl = ({ searchQuery, setSearchQuery, handleSearch, handleClearSearch }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
}) => {
  return (
    <div className="absolute top-4 right-4 z-[1001] flex gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="w-64 pr-8 bg-background/80 backdrop-blur-sm"
        />
        {searchQuery && (
          <Button
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            size="icon"
            variant="ghost"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        size="icon"
        variant="outline"
        className="bg-background/80 backdrop-blur-sm hover:bg-background"
      >
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Component to handle map click events
const MapClickHandler = ({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) => {
  useMapEvents({
    click: onMapClick
  });
  
  return null;
};

// Component to zoom to search result
const GeoSearchResult = ({ searchResult }: { searchResult: L.LatLngExpression | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchResult) {
      map.setView(searchResult, 16);
    }
  }, [map, searchResult]);
  
  return searchResult ? (
    <Marker position={searchResult}>
      <Popup>Search result</Popup>
    </Marker>
  ) : null;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'caution';
    case 'low':
      return 'safe';
    default:
      return 'primary';
  }
};

interface MapComponentProps {
  height?: string;
  showControls?: boolean;
  incidents?: CrimeIncident[];
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapComponent = ({ 
  height = "h-screen", 
  showControls = true,
  incidents = mockIncidents,
  onLocationSelect
}: MapComponentProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [viewState, setViewState] = useState({
    center: [12.9800, 77.5920] as [number, number],
    zoom: 13
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<L.LatLngExpression | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation([lat, lng]);
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use Nominatim OpenStreetMap API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchResult([parseFloat(lat), parseFloat(lon)]);
      } else {
        // Handle no results found
        console.log('No results found');
        alert('No locations found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
  };

  // Search on Enter key or button click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClearSearch();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative ${height} w-full`}>
      <MapContainer 
        center={viewState.center} 
        zoom={viewState.zoom} 
        style={{ height: '100%', zIndex: 10 }}
        ref={(map) => { if (map) mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map click handler */}
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Show user location if available */}
        {userLocation && (
          <CircleMarker 
            center={userLocation}
            radius={8}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.7 }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}
        
        {/* Display incident markers */}
        {incidents.map((incident, index) => (
          <CircleMarker
            key={index}
            center={[incident.lat, incident.lng]}
            radius={8}
            pathOptions={{ 
              color: incident.severity === 'high' ? '#ef4444' : 
                     incident.severity === 'medium' ? '#f59e0b' : '#22c55e',
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center mb-1">
                  <div className={`safety-indicator ${getSeverityColor(incident.severity)}`}></div>
                  <span className="font-medium">{incident.type}</span>
                </div>
                <p className="text-sm">{incident.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{incident.date}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Search result marker */}
        <GeoSearchResult searchResult={searchResult} />
        
        {/* Location finder button */}
        <LocationFinder onLocationFound={handleLocationFound} />
        
        {/* Map controls */}
        {showControls && <MapControls />}
      </MapContainer>
      
      {/* Search controls */}
      <SearchControl 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
      />
    </div>
  );
};

export default MapComponent;