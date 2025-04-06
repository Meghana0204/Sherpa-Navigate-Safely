
export interface CrimeIncident {
  id: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  date: string;
  time?: string;
  severity: 'low' | 'medium' | 'high';
  reported_by?: string;
}

export interface SafeRoute {
  id: string;
  startLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  safetyScore: number; // 0-100, higher is safer
  distance: number; // in meters
  duration: number; // in seconds
  path: [number, number][];
  alternativeRoutes?: {
    safetyScore: number;
    distance: number;
    duration: number;
    path: [number, number][];
  }[];
}
