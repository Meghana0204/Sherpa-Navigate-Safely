
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MapComponent from '@/components/map/MapComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ReportIncident = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [incidentType, setIncidentType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    toast.info("Location selected", {
      description: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
      duration: 3000
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedLocation) {
      toast.error("Please select a location on the map");
      return;
    }
    
    if (!incidentType) {
      toast.error("Please select an incident type");
      return;
    }
    
    if (!description) {
      toast.error("Please provide a description");
      return;
    }
    
    // In a real app, we would submit the report to a server
    toast.success("Incident reported successfully", {
      description: "Thank you for helping keep the community safe.",
      duration: 5000
    });
    
    // Reset form
    setSelectedLocation(null);
    setIncidentType('');
    setDescription('');
    setContactInfo('');
  };
  
  return (
    <PageLayout fullWidth>
      <div className="grid lg:grid-cols-2 h-screen">
        {/* Map column */}
        <div className="relative h-[300px] lg:h-full">
          <MapComponent 
            height="h-full" 
            showControls={true} 
            onLocationSelect={handleLocationSelect}
          />
          
          {/* Mobile instruction */}
          <div className="absolute top-4 left-4 right-4 z-[1005] lg:hidden">
            <Card className="bg-background/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm">Tap the map to select incident location</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Form column */}
        <div className="p-4 lg:p-8 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Report an Incident
              </CardTitle>
              <CardDescription>
                Help keep your community safe by reporting incidents anonymously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location"
                      value={selectedLocation ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}` : ''}
                      placeholder="Select a location on the map"
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click on the map to select the incident location
                  </p>
                </div>
                
                {/* Incident Type */}
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger id="incident-type">
                      <SelectValue placeholder="Select type of incident" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="robbery">Robbery</SelectItem>
                      <SelectItem value="burglary">Burglary</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="drugActivity">Drug Activity</SelectItem>
                      <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Please provide details about the incident"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                {/* Contact Info (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="contact" className="flex items-center gap-1">
                    <span>Contact Information</span>
                    <span className="text-sm text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="contact"
                    placeholder="Email or phone number (optional)"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your contact information will not be shared publicly
                  </p>
                </div>
                
                {/* Submit Button */}
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportIncident;
