import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MapControlsProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

// ⭐ Google Maps Dark Mode Styles
const darkModeStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1d1d1d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8e8e8e" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2a2a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e0e0e" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#121212" }],
  },
];

// ⭐ Main Component
const MapControls: React.FC<MapControlsProps> = ({ mapRef }) => {
  const [currentStyle, setCurrentStyle] = useState("default");

  const applyMapStyle = (style: string) => {
    const map = mapRef.current;
    if (!map) return;

    setCurrentStyle(style);

    switch (style) {
      case "default":
        map.setMapTypeId("roadmap");
        map.setOptions({ styles: [] });
        break;

      case "satellite":
        map.setMapTypeId("hybrid");
        map.setOptions({ styles: [] });
        break;

      case "terrain":
        map.setMapTypeId("terrain");
        map.setOptions({ styles: [] });
        break;

      case "dark":
        map.setMapTypeId("roadmap");
        map.setOptions({ styles: darkModeStyle });
        break;

      default:
        break;
    }
  };

  return (
    <div className="absolute left-4 bottom-20 z-[999] flex flex-col gap-2">
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
          <DropdownMenuItem onClick={() => applyMapStyle("default")}>
            Default / Roadmap
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => applyMapStyle("satellite")}>
            Satellite
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => applyMapStyle("terrain")}>
            Terrain
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => applyMapStyle("dark")}>
            Dark Mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MapControls;
