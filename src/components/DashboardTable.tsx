import { Upload, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTheme } from '../theme';
import { batches, BatchStatusType, ActionType } from '../data/batches';

const DashboardTable = () => {
  const { theme } = useTheme();

  const getStatusColor = (statusType: BatchStatusType) => {
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
  );
};

export default DashboardTable;

