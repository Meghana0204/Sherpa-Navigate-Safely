
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MapComponent from '@/components/map/MapComponent';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <PageLayout fullWidth>
      <div className="relative h-screen">
        <MapComponent />
        
        {/* Quick Action Floating Cards */}
        {!isMobile && (
          <div className="absolute top-4 left-[270px] z-[1005] flex gap-4">
            <Card className="bg-background/80 backdrop-blur-sm border shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Quick Actions</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link to="/routes">
                        <Shield className="h-4 w-4" />
                        Find Safe Route
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link to="/report">
                        <AlertTriangle className="h-4 w-4" />
                        Report Incident
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link to="/analytics">
                        <BarChart2 className="h-4 w-4" />
                        View Analytics
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Mobile Legend */}
        <div className="absolute bottom-4 left-4 right-4 z-[1005] lg:hidden">
          <Card className="bg-background/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-medium mb-2">Crime Severity Legend</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center">
                  <div className="safety-indicator safe"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center">
                  <div className="safety-indicator caution"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="safety-indicator danger"></div>
                  <span>High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
