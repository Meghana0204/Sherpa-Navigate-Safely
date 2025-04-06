import { CrimeIncident, SafeRoute } from '@/types/incidents';

// Mock crime incidents data with expanded Indian locations
export const mockIncidents: CrimeIncident[] = [
  // Delhi region
  {
    id: '1',
    type: 'Theft',
    description: 'Bicycle stolen from outside coffee shop',
    lat: 28.6139, 
    lng: 77.2090,
    date: '2025-03-15',
    severity: 'low'
  },
  {
    id: '2',
    type: 'Assault',
    description: 'Physical altercation between two individuals',
    lat: 28.6304, 
    lng: 77.2177, 
    date: '2025-03-18',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'Vandalism',
    description: 'Graffiti on public property',
    lat: 28.5621, 
    lng: 77.2841, 
    date: '2025-03-20',
    severity: 'low'
  },
  {
    id: '4',
    type: 'Harassment',
    description: 'Verbal harassment in public transport',
    lat: 28.7041, 
    lng: 77.1025, 
    date: '2025-03-22',
    severity: 'medium'
  },
  {
    id: '5',
    type: 'Robbery',
    description: 'Mobile phone snatching incident',
    lat: 28.5198, 
    lng: 77.1735, 
    date: '2025-03-25',
    severity: 'high'
  },
  {
    id: '6',
    type: 'Drug Activity',
    description: 'Suspected drug dealing near park',
    lat: 28.6129, 
    lng: 77.2295, 
    date: '2025-03-28',
    severity: 'medium'
  },
  
  // Mumbai region
  {
    id: '7',
    type: 'Theft',
    description: 'Purse snatching at crowded market',
    lat: 19.0760, 
    lng: 72.8777, 
    date: '2025-04-01',
    severity: 'medium'
  },
  {
    id: '8',
    type: 'Assault',
    description: 'Unprovoked attack on pedestrian',
    lat: 19.0596, 
    lng: 72.8295, 
    date: '2025-04-03',
    severity: 'high'
  },
  {
    id: '9',
    type: 'Burglary',
    description: 'Break-in at residential apartment',
    lat: 19.1136, 
    lng: 72.9023, 
    date: '2025-04-05',
    severity: 'high'
  },
  {
    id: '10',
    type: 'Vandalism',
    description: 'Vehicle damaged in parking lot',
    lat: 19.0178, 
    lng: 72.8478, 
    date: '2025-04-08',
    severity: 'low'
  },
  {
    id: '11',
    type: 'Harassment',
    description: 'Street harassment reported',
    lat: 19.0509, 
    lng: 72.8915, 
    date: '2025-04-10',
    severity: 'medium'
  },
  
  // Bangalore region
  {
    id: '12',
    type: 'Robbery',
    description: 'Armed robbery at convenience store',
    lat: 12.9716,
    lng: 77.5946,
    date: '2025-03-22',
    severity: 'high'
  },
  {
    id: '13',
    type: 'Theft',
    description: 'Laptop stolen from coffee shop',
    lat: 12.9352,
    lng: 77.6245,
    date: '2025-03-24',
    severity: 'medium'
  },
  {
    id: '14',
    type: 'Burglary',
    description: 'Home break-in reported in residential area',
    lat: 13.0298,
    lng: 77.5762,
    date: '2025-03-26',
    severity: 'high'
  },
  {
    id: '15',
    type: 'Vandalism',
    description: 'Property damaged in tech park',
    lat: 12.9783,
    lng: 77.6408,
    date: '2025-03-29',
    severity: 'low'
  },
  {
    id: '16',
    type: 'Harassment',
    description: 'Harassment incident near bus stop',
    lat: 12.9552,
    lng: 77.5672,
    date: '2025-04-02',
    severity: 'medium'
  },
  {
    id: '17',
    type: 'Drug Activity',
    description: 'Suspected drug dealing in public park',
    lat: 13.0012,
    lng: 77.5935,
    date: '2025-04-05',
    severity: 'medium'
  },
  
  // Chennai region
  {
    id: '18',
    type: 'Theft',
    description: 'Phone snatching near beach',
    lat: 13.0827,
    lng: 80.2707,
    date: '2025-03-19',
    severity: 'medium'
  },
  {
    id: '19',
    type: 'Assault',
    description: 'Physical altercation reported at market',
    lat: 13.0632,
    lng: 80.2515,
    date: '2025-03-21',
    severity: 'high'
  },
  {
    id: '20',
    type: 'Burglary',
    description: 'Break-in at commercial establishment',
    lat: 13.0878,
    lng: 80.2885,
    date: '2025-03-25',
    severity: 'medium'
  },
  {
    id: '21',
    type: 'Vandalism',
    description: 'Public property damaged',
    lat: 13.1067,
    lng: 80.2268,
    date: '2025-03-28',
    severity: 'low'
  },
  {
    id: '22',
    type: 'Harassment',
    description: 'Verbal harassment incident',
    lat: 13.0474,
    lng: 80.2571,
    date: '2025-04-01',
    severity: 'medium'
  },
  
  // Hyderabad region
  {
    id: '23',
    type: 'Theft',
    description: 'Wallet stolen in crowded area',
    lat: 17.3850,
    lng: 78.4867,
    date: '2025-03-17',
    severity: 'low'
  },
  {
    id: '24',
    type: 'Assault',
    description: 'Fight reported near restaurant',
    lat: 17.4399,
    lng: 78.4983,
    date: '2025-03-22',
    severity: 'medium'
  },
  {
    id: '25',
    type: 'Robbery',
    description: 'Chain snatching incident',
    lat: 17.4156,
    lng: 78.4347,
    date: '2025-03-26',
    severity: 'high'
  },
  {
    id: '26',
    type: 'Burglary',
    description: 'Home invasion reported',
    lat: 17.3616,
    lng: 78.4747,
    date: '2025-03-30',
    severity: 'high'
  },
  {
    id: '27',
    type: 'Drug Activity',
    description: 'Substance abuse reported in public',
    lat: 17.4123,
    lng: 78.5096,
    date: '2025-04-04',
    severity: 'medium'
  },
  
  // Kolkata region
  {
    id: '28',
    type: 'Theft',
    description: 'Bag snatched from pedestrian',
    lat: 22.5726,
    lng: 88.3639,
    date: '2025-03-18',
    severity: 'medium'
  },
  {
    id: '29',
    type: 'Assault',
    description: 'Verbal altercation turned physical',
    lat: 22.5958,
    lng: 88.3776,
    date: '2025-03-23',
    severity: 'high'
  },
  {
    id: '30',
    type: 'Vandalism',
    description: 'Store front damaged',
    lat: 22.5654,
    lng: 88.3512,
    date: '2025-03-27',
    severity: 'low'
  },
  {
    id: '31',
    type: 'Harassment',
    description: 'Street harassment incident',
    lat: 22.5475,
    lng: 88.3403,
    date: '2025-04-01',
    severity: 'medium'
  },
  
  // Kochi region
  {
    id: '32',
    type: 'Theft',
    description: 'Tourist reported stolen camera',
    lat: 9.9312,
    lng: 76.2673,
    date: '2025-03-19',
    severity: 'medium'
  },
  {
    id: '33',
    type: 'Vandalism',
    description: 'Public bench damaged',
    lat: 9.9659,
    lng: 76.2513,
    date: '2025-03-24',
    severity: 'low'
  },
  {
    id: '34',
    type: 'Harassment',
    description: 'Harassment reported at market',
    lat: 9.9894,
    lng: 76.2856,
    date: '2025-03-29',
    severity: 'medium'
  },
  
  // Coimbatore region
  {
    id: '35',
    type: 'Theft',
    description: 'Mobile phone stolen at bus station',
    lat: 11.0168,
    lng: 76.9558,
    date: '2025-03-20',
    severity: 'medium'
  },
  {
    id: '36',
    type: 'Assault',
    description: 'Physical fight reported',
    lat: 11.0235,
    lng: 76.9240,
    date: '2025-03-25',
    severity: 'high'
  },
  {
    id: '37',
    type: 'Burglary',
    description: 'Shop break-in overnight',
    lat: 10.9925,
    lng: 76.9745,
    date: '2025-03-30',
    severity: 'medium'
  },
  
  // Pune region
  {
    id: '38',
    type: 'Theft',
    description: 'Bicycle stolen from apartment complex',
    lat: 18.5204,
    lng: 73.8567,
    date: '2025-03-21',
    severity: 'low'
  },
  {
    id: '39',
    type: 'Robbery',
    description: 'Jewelry snatched from pedestrian',
    lat: 18.5383,
    lng: 73.8326,
    date: '2025-03-26',
    severity: 'high'
  },
  {
    id: '40',
    type: 'Vandalism',
    description: 'Car vandalized in parking lot',
    lat: 18.5073,
    lng: 73.8077,
    date: '2025-03-31',
    severity: 'medium'
  },
  
  // Jaipur region
  {
    id: '41',
    type: 'Theft',
    description: 'Tourist reported stolen belongings',
    lat: 26.9124,
    lng: 75.7873,
    date: '2025-03-22',
    severity: 'medium'
  },
  {
    id: '42',
    type: 'Assault',
    description: 'Altercation in market area',
    lat: 26.9260,
    lng: 75.8235,
    date: '2025-03-27',
    severity: 'medium'
  },
  {
    id: '43',
    type: 'Harassment',
    description: 'Tourist harassment incident',
    lat: 26.8851,
    lng: 75.7950,
    date: '2025-04-01',
    severity: 'medium'
  },
  
  // More incidents in South India
  
  // Madurai
  {
    id: '44',
    type: 'Theft',
    description: 'Wallet stolen at temple',
    lat: 9.9252,
    lng: 78.1198,
    date: '2025-03-20',
    severity: 'medium'
  },
  {
    id: '45',
    type: 'Vandalism',
    description: 'Temple property damaged',
    lat: 9.9390,
    lng: 78.1348,
    date: '2025-03-25',
    severity: 'low'
  },
  
  // Trichy
  {
    id: '46',
    type: 'Theft',
    description: 'Mobile phone stolen at bus station',
    lat: 10.7905,
    lng: 78.7047,
    date: '2025-03-21',
    severity: 'medium'
  },
  {
    id: '47',
    type: 'Harassment',
    description: 'Verbal harassment reported',
    lat: 10.8113,
    lng: 78.6950,
    date: '2025-03-26',
    severity: 'medium'
  },
  
  // Vijayawada
  {
    id: '48',
    type: 'Theft',
    description: 'Vehicle accessory theft',
    lat: 16.5062,
    lng: 80.6480,
    date: '2025-03-22',
    severity: 'low'
  },
  {
    id: '49',
    type: 'Assault',
    description: 'Physical altercation in public',
    lat: 16.5107,
    lng: 80.6287,
    date: '2025-03-27',
    severity: 'high'
  },
  
  // Thiruvananthapuram
  {
    id: '50',
    type: 'Theft',
    description: 'Purse snatching near beach',
    lat: 8.5241,
    lng: 76.9366,
    date: '2025-03-23',
    severity: 'medium'
  },
  {
    id: '51',
    type: 'Vandalism',
    description: 'Public property damaged',
    lat: 8.4875,
    lng: 76.9492,
    date: '2025-03-28',
    severity: 'low'
  },
  
  // Mysore
  {
    id: '52',
    type: 'Theft',
    description: 'Tourist reported stolen camera',
    lat: 12.2958,
    lng: 76.6394,
    date: '2025-03-24',
    severity: 'medium'
  },
  {
    id: '53',
    type: 'Harassment',
    description: 'Harassment reported near palace',
    lat: 12.3052,
    lng: 76.6552,
    date: '2025-03-29',
    severity: 'medium'
  },
  
  // More Bangalore incidents
  {
    id: '54',
    type: 'Theft',
    description: 'Phone stolen at restaurant',
    lat: 12.9850,
    lng: 77.5533,
    date: '2025-03-17',
    severity: 'medium'
  },
  {
    id: '55',
    type: 'Burglary',
    description: 'Apartment break-in',
    lat: 12.9445,
    lng: 77.6126,
    date: '2025-03-21',
    severity: 'high'
  },
  {
    id: '56',
    type: 'Vandalism',
    description: 'Bus stop damaged',
    lat: 13.0206,
    lng: 77.5560,
    date: '2025-03-25',
    severity: 'low'
  },
  {
    id: '57',
    type: 'Harassment',
    description: 'Street harassment incident',
    lat: 12.9279,
    lng: 77.6271,
    date: '2025-03-29',
    severity: 'medium'
  },
  {
    id: '58',
    type: 'Assault',
    description: 'Fight reported outside pub',
    lat: 12.9698,
    lng: 77.7499,
    date: '2025-04-02',
    severity: 'high'
  },
  {
    id: '59',
    type: 'Drug Activity',
    description: 'Suspected drug dealing in park',
    lat: 13.0632,
    lng: 77.5803,
    date: '2025-04-06',
    severity: 'medium'
  },
  {
    id: '60',
    type: 'Theft',
    description: 'Laptop stolen from cafe',
    lat: 12.9769,
    lng: 77.6018,
    date: '2025-04-10',
    severity: 'medium'
  }
];

// Mock safe routes data
export const mockSafeRoutes: SafeRoute[] = [
  // Bangalore route
  {
    id: '3',
    startLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'MG Road, Bangalore'
    },
    endLocation: {
      lat: 13.0298,
      lng: 77.5762,
      address: 'Hebbal, Bangalore'
    },
    safetyScore: 88,
    distance: 9300,
    duration: 1680,
    path: [
      [12.9716, 77.5946],
      [12.9800, 77.5920],
      [12.9900, 77.5890],
      [13.0100, 77.5830],
      [13.0298, 77.5762]
    ],
    alternativeRoutes: [
      {
        safetyScore: 76,
        distance: 8800,
        duration: 1560,
        path: [
          [12.9716, 77.5946],
          [12.9850, 77.5900],
          [13.0050, 77.5850],
          [13.0298, 77.5762]
        ]
      }
    ]
  },

  // Mumbai route
  {
    id: '2',
    startLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Marine Drive, Mumbai'
    },
    endLocation: {
      lat: 19.0596,
      lng: 72.8295,
      address: 'Bandra, Mumbai'
    },
    safetyScore: 82,
    distance: 8700,
    duration: 1500,
    path: [
      [19.0760, 72.8777],
      [19.0720, 72.8700],
      [19.0680, 72.8600],
      [19.0630, 72.8400],
      [19.0596, 72.8295]
    ],
    alternativeRoutes: [
      {
        safetyScore: 78,
        distance: 8200,
        duration: 1400,
        path: [
          [19.0760, 72.8777],
          [19.0740, 72.8650],
          [19.0650, 72.8450],
          [19.0596, 72.8295]
        ]
      }
    ]
  },
// Delhi route
{
  id: '1',
  startLocation: {
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, New Delhi'
  },
  endLocation: {
    lat: 28.6304,
    lng: 77.2177,
    address: 'Karol Bagh, New Delhi'
  },
  safetyScore: 85,
  distance: 4500,
  duration: 900,
  path: [
    [28.6139, 77.2090],
    [28.6160, 77.2110],
    [28.6200, 77.2140],
    [28.6250, 77.2160],
    [28.6304, 77.2177]
  ],
  alternativeRoutes: [
    {
      safetyScore: 75,
      distance: 4200,
      duration: 820,
      path: [
        [28.6139, 77.2090],
        [28.6180, 77.2130],
        [28.6230, 77.2150],
        [28.6304, 77.2177]
      ]
    },
    {
      safetyScore: 92,
      distance: 5000,
      duration: 1080,
      path: [
        [28.6139, 77.2090],
        [28.6170, 77.2050],
        [28.6220, 77.2080],
        [28.6270, 77.2130],
        [28.6304, 77.2177]
      ]
    }
  ]
},
];

// Crime statistics by category
export const crimeStatsByCategory = {
  theft: 22,
  assault: 14,
  vandalism: 10,
  robbery: 8,
  burglary: 6,
  harassment: 15,
  drugActivity: 5
};

// Crime statistics by time of day
export const crimeStatsByTime = {
  morning: 12,
  afternoon: 20,
  evening: 35,
  night: 43
};

// Historical crime data for trends
export const historicalCrimeData = [
  { month: 'January', count: 90 },
  { month: 'February', count: 85 },
  { month: 'March', count: 75 },
  { month: 'April', count: 84 },
  { month: 'May', count: 80 },
  { month: 'June', count: 65 },
  { month: 'July', count: 64 },
  { month: 'August', count: 73 },
  { month: 'September', count: 83 },
  { month: 'October', count: 87 },
  { month: 'November', count: 91 },
  { month: 'December', count: 88 }
];

// Area safety scores
export const areaSafetyScores = [
  { area: 'South Delhi', score: 82 },
  { area: 'Central Delhi', score: 75 },
  { area: 'South Mumbai', score: 88 },
  { area: 'Andheri', score: 72 },
  { area: 'Koramangala', score: 86 },
  { area: 'Indiranagar', score: 83 },
  { area: 'Whitefield', score: 77 },
  { area: 'T Nagar', score: 79 },
  { area: 'Adyar', score: 85 },
  { area: 'Jubilee Hills', score: 89 },
  { area: 'Banjara Hills', score: 83 },
  { area: 'Salt Lake', score: 87 },
  { area: 'Alipore', score: 90 },
  { area: 'Kochi Central', score: 84 },
  { area: 'Fort Kochi', score: 76 }
];