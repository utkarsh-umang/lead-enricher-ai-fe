import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContentContainer from './MainContentContainer';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <Navbar isLoggedIn={true} />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area - offset to accommodate sidebar */}
      <main className="lg:ml-64 min-h-screen transition-all duration-300">
        <MainContentContainer>
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </MainContentContainer>
      </main>
    </div>
  );
};

export default DashboardLayout;