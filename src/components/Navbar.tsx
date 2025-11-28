import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useTheme } from '../theme';
import enleadLogo from '../assets/enleaed_logo.png';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user name from localStorage on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const storedName = localStorage.getItem('userName') || 'User';
      setUserName(storedName);
    }
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Hide navbar when logged in (navigation handled by sidebar)
  if (isLoggedIn) {
    return null;
  }

  return (
    <nav 
      className="shadow-md fixed top-0 right-0 left-0 z-10"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={enleadLogo} 
              alt="EnLead Logo" 
              className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Right side content */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              /* User Avatar and Dropdown - for logged in users */
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-medium cursor-pointer"
                  style={{ 
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getInitials(userName)}
                </div>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10"
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
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      style={{ color: theme.palette.error.main }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Get Started button - for not logged in users */
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;