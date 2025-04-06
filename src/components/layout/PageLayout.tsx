
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const PageLayout = ({ children, fullWidth = false }: PageLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen">
      <Navbar currentPath={currentPath} />
      <main className={`flex-1 ${fullWidth ? 'overflow-hidden' : 'p-4 lg:p-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
