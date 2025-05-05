import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileSpreadsheet, LayoutGrid, ChevronLeft, Menu, Brain, LineChart } from 'lucide-react';
import { clsx } from 'clsx';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  section: string;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Determine active section based on path
  const getActiveSection = (path: string) => {
    if (path === '/' || path.startsWith('/connect') || path.startsWith('/sheet-details')) {
      return 'sheets';
    }
    if (path.startsWith('/enrichment') || path.startsWith('/enrichments')) {
      return 'enrichments';
    }
    if (path.startsWith('/campaigns')) {
      return 'campaigns';
    }
    return '';
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection(location.pathname));
  
  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection(location.pathname));
  }, [location.pathname]);
  
  // Navigation items
  const navItems: NavItem[] = [
    {
      name: 'Connected Sheets',
      path: '/',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      section: 'sheets'
    },
    {
      name: 'Enrichments',
      path: '/enrichments', // Updated to point to the new landing page
      icon: <LineChart className="h-5 w-5" />,
      section: 'enrichments'
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: <LayoutGrid className="h-5 w-5" />,
      section: 'campaigns'
    }
  ];
  
  // Handle navigation
  const handleNavigation = (path: string, section: string) => {
    setActiveSection(section);
    navigate(path);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };
  
  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      {/* Sidebar backdrop for mobile - only visible when mobile sidebar is open */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-20",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!collapsed && (
            <div className='flex'>
              <Brain className="h-8 w-8 mr-2 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                EnLead AI
              </h2>
            </div>
          )}
          
          <button 
            onClick={toggleCollapse}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:block hidden"
          >
            <ChevronLeft className={clsx(
              "h-5 w-5 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.path, item.section)}
                  className={clsx(
                    "w-full flex items-center px-4 py-3 rounded-lg transition-colors",
                    activeSection === item.section 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;