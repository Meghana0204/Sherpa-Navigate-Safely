
import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Layers
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MapStyle {
  name: string;
  url: string;
}

const MapControls = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  // Define different map styles/layers
  const mapStyles: MapStyle[] = [
    { name: 'Street', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
    { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
    { name: 'Dark', url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png' }
  ];
  
  const changeMapStyle = (styleUrl: string) => {
    // Remove current tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add new tile layer
    new L.TileLayer(styleUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  };
  
  return (
    <div className="absolute left-4 bottom-20 z-[999] flex flex-col gap-2">
      <Button 
        onClick={handleZoomIn} 
        size="icon" 
        variant="outline"
        className="bg-background/80 backdrop-blur-sm hover:bg-background"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      
      <Button 
        onClick={handleZoomOut} 
        size="icon" 
        variant="outline"
        className="bg-background/80 backdrop-blur-sm hover:bg-background"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            variant="outline"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <Layers className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {mapStyles.map((style) => (
            <DropdownMenuItem 
              key={style.name}
              onClick={() => changeMapStyle(style.url)}
            >
              {style.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MapControls;
