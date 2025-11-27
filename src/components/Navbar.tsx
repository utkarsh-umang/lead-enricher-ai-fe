import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { authService } from '../services/authService';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const navigate = useNavigate();
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

  // Determine if sidebar is present (logged in view)
  const hasSidebar = isLoggedIn;

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 left-0 z-10">
      <div className={`max-w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${hasSidebar ? 'lg:ml-64' : ''}`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              EnLead AI
            </span>
          </div>
          
          {/* Right side content */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              /* User Avatar and Dropdown - for logged in users */
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getInitials(userName)}
                </div>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      Signed in as <span className="font-medium">{userName}</span>
                    </div>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
              /* Login/Signup buttons - for not logged in users */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;