import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <Navbar isLoggedIn={false} />
      
      {/* Main content area */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default LandingLayout;

