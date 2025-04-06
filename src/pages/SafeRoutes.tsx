import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MapComponent from '@/components/map/MapComponent';
import { mockSafeRoutes } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, CornerDownRight, Shield, RefreshCw, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';

const SafeRoutes = () => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [isRouteCalculated, setIsRouteCalculated] = useState<boolean>(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const currentRoute = mockSafeRoutes[0];

  const handleCalculateRoute = () => {
    setIsRouteCalculated(true);
  };

  const resetRoute = () => {
    setStartLocation('');
    setEndLocation('');
    setIsRouteCalculated(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setStartLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)} km` 
      : `${meters} m`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getSafetyClass = (score: number) => {
    if (score >= 85) return 'safe';
    if (score >= 70) return 'caution';
    return 'danger';
  };

  return (
    <PageLayout fullWidth>
      <div className="relative h-screen">
        <MapComponent height="h-screen" />

        <div className="absolute top-4 left-[270px] z-[1005] max-w-md lg:w-[450px] w-[calc(100%-290px)]">
          <Card className="bg-background/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle>Find Safe Routes</CardTitle>
            </CardHeader>
            <CardContent>
              {!isRouteCalculated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <Input 
                      placeholder="Starting point" 
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                    />
                    <Button size="icon" variant="ghost" onClick={getCurrentLocation} title="Use my location">
                      <LocateFixed className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-3 items-center">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <Input 
                      placeholder="Destination" 
                      value={endLocation}
                      onChange={(e) => setEndLocation(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleCalculateRoute}
                    className="mt-2 w-full gap-2"
                    disabled={!startLocation || !endLocation}
                  >
                    <Shield className="h-4 w-4" />
                    Calculate Safe Route
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Route summary */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{currentRoute.startLocation.address}</span>
                    </div>

                    <div className="ml-2 border-l-2 border-dashed border-muted h-4"></div>

                    <div className="flex items-center gap-2 text-sm">
                      <CornerDownRight className="h-4 w-4 text-primary" />
                      <span className="font-medium">{currentRoute.endLocation.address}</span>
                    </div>
                  </div>

                  {/* Route options */}
                  <div className="mt-2">
                    <h3 className="text-sm font-medium mb-2">Available Routes</h3>

                    {/* Main route */}
                    <div 
                      className={cn(
                        "border rounded-md p-3 mb-2 cursor-pointer hover:bg-accent",
                        selectedRouteIndex === 0 ? "bg-accent" : ""
                      )}
                      onClick={() => setSelectedRouteIndex(0)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`safety-indicator ${getSafetyClass(currentRoute.safetyScore)}`}></div>
                          <span className="font-medium">Recommended Route</span>
                        </div>
                        <span className="text-sm">
                          {formatDistance(currentRoute.distance)} • {formatDuration(currentRoute.duration)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm">
                        Safety Score: <span className="font-medium">{currentRoute.safetyScore}/100</span>
                      </div>
                    </div>

                    {/* Alternative routes */}
                    {currentRoute.alternativeRoutes?.map((route, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "border rounded-md p-3 mb-2 cursor-pointer hover:bg-accent",
                          selectedRouteIndex === index + 1 ? "bg-accent" : ""
                        )}
                        onClick={() => setSelectedRouteIndex(index + 1)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`safety-indicator ${getSafetyClass(route.safetyScore)}`}></div>
                            <span className="font-medium">
                              {index === 0 ? "Fastest Route" : "Alternative Route"}
                            </span>
                          </div>
                          <span className="text-sm">
                            {formatDistance(route.distance)} • {formatDuration(route.duration)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          Safety Score: <span className="font-medium">{route.safetyScore}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetRoute}
                    className="mt-2 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Route
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SafeRoutes;
