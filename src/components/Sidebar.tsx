import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Menu, ChevronLeft, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
// import enleadBadge from '../assets/enlead_badge.png';
import { useTheme } from '../theme';
import { authService } from '../services/authService';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  section: string;
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Determine active section based on path
  const getActiveSection = (path: string) => {
    if (path === '/' || path.startsWith('/dashboard')) {
      return 'dashboard';
    }
    return '';
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection(location.pathname));
  
  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection(location.pathname));
  }, [location.pathname]);

  // Get user name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Generate initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    authService.logout();
  };
  
  // Navigation items
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutGrid className="h-5 w-5" />,
      section: 'dashboard'
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
          className="p-2 rounded-md shadow-md transition-colors"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.secondary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.paper;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.default;
          }}
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
          "fixed top-0 left-0 h-screen shadow-lg transition-all duration-300 z-20 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ 
          background: 'linear-gradient(180deg, #E8D5B7 0%, #D4AF37 50%, #B8860B 100%)'
        }}
      >
        {/* Sidebar header */}
        <div 
          className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0"
          style={{ borderColor: theme.palette.divider }}
        >
          {!collapsed && (
            <div className='hidden lg:flex '>
              <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>
                Enlead AI
              </h1>
            </div>
          )}
          
          <button 
            onClick={toggleCollapse}
            className={clsx(
              "p-2 rounded-md hover:opacity-80 transition-opacity lg:block hidden outline-none focus:outline-none",
              collapsed && "w-full flex justify-center"
            )}
            style={{ 
              color: theme.palette.text.disabled,
              backgroundColor: theme.palette.background.paper
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronLeft className={clsx(
              "h-5 w-5 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.path, item.section)}
                    className="w-full flex items-center px-4 py-3 rounded-lg transition-colors border-0 outline-none focus:outline-none"
                    style={{
                      backgroundColor: isActive ? theme.palette.background.default : 'transparent',
                      color: isActive ? theme.palette.primary.dark : theme.palette.text.secondary,
                      border: 'none',
                      borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.palette.background.default;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div 
          className="border-t p-4 flex-shrink-0"
          style={{ borderColor: theme.palette.divider }}
        >
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-3">
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-lg font-medium truncate"
                    style={{ color: theme.palette.text.primary }}
                  >
                    {userName}
                  </p>
                </div>
              )}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-medium flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false);
                    // Small delay to ensure sidebar expands before opening dropdown
                    setTimeout(() => setDropdownOpen(true), 100);
                  } else {
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
              >
                {getInitials(userName)}
              </div>
            </div>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg py-1 z-10"
                style={{ backgroundColor: theme.palette.background.default }}
              >
                <div 
                  className="px-4 py-2 text-sm border-b"
                  style={{ 
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider
                  }}
                >
                  Signed in as <span className="font-medium" style={{ color: theme.palette.text.primary }}>{userName}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-left transition-colors outline-none focus:outline-none"
                  style={{ 
                    color: theme.palette.error.main,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;