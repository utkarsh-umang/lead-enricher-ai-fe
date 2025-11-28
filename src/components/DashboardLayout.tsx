import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContentContainer from './MainContentContainer';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <Navbar isLoggedIn={true} />
      
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main content area - offset to accommodate sidebar */}
      <main 
        className={clsx(
          "min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
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