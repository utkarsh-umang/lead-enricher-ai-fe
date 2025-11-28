import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useTheme } from '../theme';

const NotificationButton = () => {
  const { theme } = useTheme();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="p-2 rounded-lg transition-colors outline-none focus:outline-none"
        style={{ 
          color: theme.palette.text.secondary,
          border: `1px solid ${isNotificationOpen ? theme.palette.primary.main : theme.palette.divider}`
        }}
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.palette.background.paper;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Bell className="w-5 h-5" style={{ color: theme.palette.text.secondary }} />
      </button>
      
      {/* Notification Popup */}
      {isNotificationOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: theme.palette.divider }}>
            <h3 className="text-sm font-semibold" style={{ color: theme.palette.text.primary }}>
              Notifications
            </h3>
          </div>
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 mx-auto mb-3" style={{ color: theme.palette.text.secondary, opacity: 0.5 }} />
            <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
              No new notifications
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;

