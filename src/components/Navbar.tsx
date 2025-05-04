import { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 left-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64 transition-all duration-300">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title - centered on mobile, left-aligned on desktop with sidebar space */}
          <div className="lg:hidden flex items-center ml-10">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              EnLead AI
            </span>
          </div>
          
          {/* This div is for spacing in desktop view */}
          <div className="hidden lg:block"></div>
          
          {/* User Avatar and Dropdown - always aligned to right */}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;