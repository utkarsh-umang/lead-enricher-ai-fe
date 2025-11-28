import { useState, useEffect, useRef } from 'react';
import { Bell, Plus, TrendingUp, Mail, Upload, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTheme } from '../theme';

const DashboardPage = () => {
  const { theme } = useTheme();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewListImportClicked, setIsNewListImportClicked] = useState(false);
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

  // Sample data for batches
  const batches = [
    {
      id: 1,
      listName: 'SaaS Founders Q4',
      source: 'Apollo',
      sourceType: 'apollo',
      dateImported: 'Oct 26',
      status: 'Scraping...',
      statusType: 'warning',
      progress: 60,
      action: 'View Details',
      actionType: 'secondary'
    },
    {
      id: 2,
      listName: 'Local Agencies',
      source: 'LinkedIn',
      sourceType: 'linkedin',
      dateImported: 'Oct 25',
      status: 'Generating Emails...',
      statusType: 'info',
      progress: 25,
      action: 'View Drafts',
      actionType: 'secondary'
    },
    {
      id: 3,
      listName: 'E-commerce Leads Nov',
      source: 'Upload',
      sourceType: 'upload',
      dateImported: 'Oct 24',
      status: 'Completed',
      statusType: 'success',
      progress: 100,
      action: 'Export CSV',
      actionType: 'primary'
    },
    {
      id: 4,
      listName: 'Raw Marketing List',
      source: 'Unknown',
      sourceType: 'unknown',
      dateImported: 'Today, 10:15 AM',
      status: 'Processing Upload (Deduplicating)',
      statusType: 'processing',
      progress: 0,
      action: null,
      actionType: null
    }
  ];

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'success':
        return {
          backgroundColor: `${theme.palette.success.main}20`,
          color: theme.palette.success.main,
          borderColor: `${theme.palette.success.main}40`
        };
      case 'warning':
        return {
          backgroundColor: `${theme.palette.warning.main}20`,
          color: theme.palette.warning.main,
          borderColor: `${theme.palette.warning.main}40`
        };
      case 'info':
        return {
          backgroundColor: `${theme.palette.info.main}20`,
          color: theme.palette.info.main,
          borderColor: `${theme.palette.info.main}40`
        };
      case 'processing':
        return {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider
        };
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'apollo':
        return (
          <div 
            className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: theme.palette.info.main }}
          >
            A
          </div>
        );
      case 'linkedin':
        return (
          <div 
            className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: theme.palette.info.main }}
          >
            in
          </div>
        );
      case 'upload':
        return <Upload className="w-5 h-5" style={{ color: theme.palette.text.secondary }} />;
      case 'unknown':
        return <HelpCircle className="w-5 h-5" style={{ color: theme.palette.text.secondary }} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          {/* Bell Icon with Notification Popup */}
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
          
          {/* New List Import Button */}
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 outline-none focus:outline-none"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              outline: isNewListImportClicked ? `2px solid ${theme.palette.primary.main}` : 'none',
              outlineOffset: '2px'
            }}
            onClick={() => setIsNewListImportClicked(!isNewListImportClicked)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.palette.primary.main;
            }}
          >
            <Plus className="w-4 h-4" style={{ color: theme.palette.primary.contrastText }} />
            New List Import
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Leads Enriched */}
        <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: theme.palette.background.default, borderColor: theme.palette.divider }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
              Total Leads Enriched
            </h3>
            <TrendingUp className="w-4 h-4" style={{ color: theme.palette.success.main }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
            12,450
          </p>
        </div>

        {/* Emails Generated */}
        <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: theme.palette.background.default, borderColor: theme.palette.divider }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
              Emails Generated
            </h3>
            <Mail className="w-4 h-4" style={{ color: theme.palette.text.secondary }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
            45,100
          </p>
        </div>

        {/* Credits Remaining */}
        <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: theme.palette.background.default, borderColor: theme.palette.divider }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
              Credits Remaining
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {/* Circular Progress */}
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={theme.palette.divider}
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={theme.palette.info.main}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.75)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold" style={{ color: theme.palette.text.primary }}>75%</span>
              </div>
            </div>
            <div>
              <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                7,500 / 10,000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Batches & Activity Table */}
      <div className="rounded-lg shadow-sm border" style={{ backgroundColor: theme.palette.background.default, borderColor: theme.palette.divider }}>
        <div className="p-6 border-b" style={{ borderColor: theme.palette.divider }}>
          <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.primary }}>
            Recent Batches & Activity
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: theme.palette.divider }}>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  List Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Source
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Date Imported
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Status & Progress
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr 
                  key={batch.id} 
                  className="border-b transition-colors" 
                  style={{ borderColor: theme.palette.divider }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="py-4 px-6">
                    <span className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {batch.listName}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(batch.sourceType)}
                      <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                        {batch.source}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {batch.dateImported}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={getStatusColor(batch.statusType)}
                        >
                          {batch.statusType === 'processing' && (
                            <Loader2 className="w-3 h-3 inline-block mr-1 animate-spin" />
                          )}
                          {batch.statusType === 'success' && (
                            <CheckCircle2 className="w-3 h-3 inline-block mr-1" />
                          )}
                          {batch.status}
                        </span>
                      </div>
                      {batch.progress > 0 && batch.statusType !== 'success' && (
                        <div 
                          className="w-32 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: theme.palette.divider }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${batch.progress}%`,
                              backgroundColor: theme.palette.info.main
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {batch.action && (
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={
                          batch.actionType === 'primary'
                            ? {
                                backgroundColor: theme.palette.info.main,
                                color: '#FFFFFF'
                              }
                            : {
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary
                              }
                        }
                        onMouseEnter={(e) => {
                          if (batch.actionType === 'primary') {
                            e.currentTarget.style.backgroundColor = '#0277BD';
                          } else {
                            e.currentTarget.style.backgroundColor = theme.palette.divider;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (batch.actionType === 'primary') {
                            e.currentTarget.style.backgroundColor = theme.palette.info.main;
                          } else {
                            e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                          }
                        }}
                      >
                        {batch.action}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

