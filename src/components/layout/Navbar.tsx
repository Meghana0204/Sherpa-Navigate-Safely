
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, BarChart2, AlertTriangle, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const NavLink = ({ 
  to, 
  icon: Icon, 
  children, 
  active = false 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  active?: boolean 
}) => {
  return (
    <Link to={to}>
      <Button 
        variant={active ? "default" : "ghost"} 
        className={cn("w-full justify-start gap-2", 
          active ? "bg-primary text-primary-foreground" : ""
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </Button>
    </Link>
  );
};

interface NavbarProps {
  currentPath: string;
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const isMobile = useIsMobile();
  
  const NavLinks = () => (
    <div className="flex flex-col gap-2 w-full">
      <NavLink to="/" icon={MapPin} active={currentPath === "/"}>
        Map
      </NavLink>
      <NavLink to="/routes" icon={Shield} active={currentPath === "/routes"}>
        Safe Routes
      </NavLink>
      <NavLink to="/report" icon={AlertTriangle} active={currentPath === "/report"}>
        Report Incident
      </NavLink>
      <NavLink to="/analytics" icon={BarChart2} active={currentPath === "/analytics"}>
        Analytics
      </NavLink>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-4">
              <div className="flex flex-col h-full">
                <div className="mb-8 mt-2">
                  <Link to="/" className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">SafeRoutes</h1>
                  </Link>
                </div>
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col h-screen w-[250px] p-4 border-r">
          <div className="mb-8 mt-2">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Sherpa</h1>
            </Link>
          </div>
          <NavLinks />
        </div>
      )}
    </>
  );
};

export default Navbar;
