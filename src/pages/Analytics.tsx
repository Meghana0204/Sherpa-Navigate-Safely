
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Map,
  AlertTriangle,
  Calendar,
  Clock,
  Tag,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import PageLayout from '@/components/layout/PageLayout';
import { crimeStatsByCategory, crimeStatsByTime, historicalCrimeData, areaSafetyScores } from '@/data/mockData';

// Custom tooltip content for charts
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">{`Incidents: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Incidents: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Convert object data to array format for charts
const categoryData = Object.entries(crimeStatsByCategory).map(([name, value]) => ({
  name,
  value
}));

const timeData = Object.entries(crimeStatsByTime).map(([name, value]) => ({
  name,
  value
}));

// Custom colors for charts
const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f97316'];

// Get a color based on safety score
const getSafetyColor = (score: number) => {
  if (score >= 85) return '#22c55e'; // Green for safe
  if (score >= 70) return '#fbbf24'; // Yellow for caution
  return '#f87171'; // Red for danger
};

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('6months');
  const [areaFilter, setAreaFilter] = useState('all');

  // Helper to get trend indicator and color based on change
  const getTrendIndicator = (change: number) => {
    if (change > 0) {
      return { icon: <TrendingUp className="h-4 w-4 text-red-500" />, color: 'text-red-500' };
    } else {
      return { icon: <TrendingDown className="h-4 w-4 text-green-500" />, color: 'text-green-500' };
    }
  };

  // Filtering function for charts based on user selection
  const getFilteredData = () => {
    // In a real app, this would filter data based on timeFilter and areaFilter
    return historicalCrimeData;
  };

  return (
    <PageLayout>
      <div className="container mx-auto p-4 lg:p-6">
        <div className="mb-6 mt-2">
          <h1 className="text-3xl font-bold tracking-tight">Crime Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed statistics and trends about criminal activities in your area
          </p>
        </div>

        {/* Filters and controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Period</SelectLabel>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Area</SelectLabel>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="midtown">Midtown</SelectItem>
                <SelectItem value="uptown">Uptown</SelectItem>
                <SelectItem value="westside">West Side</SelectItem>
                <SelectItem value="eastside">East Side</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-auto">
            <Input 
              placeholder="Search incidents by location" 
              className="w-full sm:w-[300px]"
            />
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                  <p className="text-3xl font-bold">842</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">4.3%</span>
                </div>
                <span className="text-xs text-muted-foreground">from previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Safety Score</p>
                  <p className="text-3xl font-bold">78/100</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">2.1%</span>
                </div>
                <span className="text-xs text-muted-foreground">improved safety</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Highest Crime</p>
                  <p className="text-3xl font-bold">Theft</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-xs text-muted-foreground">32% of all reported incidents</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Time</p>
                  <p className="text-3xl font-bold">Night</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-xs text-muted-foreground">between 8pm and 2am</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart tabs */}
        <Tabs defaultValue="trends" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Areas</span>
            </TabsTrigger>
          </TabsList>

          {/* Trend over time chart */}
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Crime Trends Over Time</span>
                  <div className="flex items-center gap-2 text-sm font-normal">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Based on reported incidents</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Monthly incidents over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getFilteredData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breakdown by category chart */}
          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle>Crime Breakdown by Category</CardTitle>
                <CardDescription>
                  Distribution of incidents by crime type
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row items-center justify-center">
                <div className="h-[400px] w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full lg:w-1/2 gap-4 p-4">
                  {categoryData.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className={`h-1 bg-[${COLORS[index % COLORS.length]}]`}></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium capitalize">{item.name}</p>
                            <p className="text-2xl font-bold mt-1">{item.value}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((item.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time of day comparison chart */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Crime by Time of Day</CardTitle>
                <CardDescription>
                  Comparing incident rates by time of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="#8884d8" 
                        radius={[4, 4, 0, 0]}
                        barSize={60}
                      >
                        {timeData.map((entry, index) => {
                          let color = '#4ade80'; // Green for morning
                          if (entry.name === 'evening') color = '#fbbf24'; // Yellow for evening
                          if (entry.name === 'night') color = '#f87171'; // Red for night
                          
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Area safety comparison chart */}
          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Safety Score by Area</CardTitle>
                <CardDescription>
                  Comparative safety ratings of different neighborhoods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={areaSafetyScores}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="area" type="category" width={100} />
                      <Tooltip />
                      <Bar 
                        dataKey="score" 
                        radius={[0, 4, 4, 0]}
                        barSize={30}
                      >
                        {areaSafetyScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getSafetyColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-8 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">High Safety (85-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-sm">Medium Safety (70-84)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Low Safety (0-69)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Recent Crime Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* In a real app, this would be dynamic data */}
              <div className="border-l-2 pl-4 py-2 border-red-500">
                <p className="font-medium">Robbery</p>
                <p className="text-sm text-muted-foreground">123 Main Street, 2 days ago</p>
                <p className="text-sm mt-1">Armed robbery at convenience store. Suspect apprehended.</p>
              </div>
              <div className="border-l-2 pl-4 py-2 border-amber-500">
                <p className="font-medium">Assault</p>
                <p className="text-sm text-muted-foreground">Park Avenue, 3 days ago</p>
                <p className="text-sm mt-1">Physical altercation between two individuals. No serious injuries.</p>
              </div>
              <div className="border-l-2 pl-4 py-2 border-green-500">
                <p className="font-medium">Theft</p>
                <p className="text-sm text-muted-foreground">Downtown Shopping Center, 5 days ago</p>
                <p className="text-sm mt-1">Bicycle stolen from outside coffee shop. Security camera footage under review.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Events</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Safety Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Stay aware of your surroundings</p>
                  <p className="text-sm text-muted-foreground">Avoid distractions like phone use while walking, especially at night.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Use the SafeRoutes feature</p>
                  <p className="text-sm text-muted-foreground">Plan your journey using our app to take the safest paths.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Report suspicious activity</p>
                  <p className="text-sm text-muted-foreground">Use our app to anonymously report incidents or call local authorities.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">More Safety Tips</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
