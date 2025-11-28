import { TrendingUp, Mail } from 'lucide-react';
import { useTheme } from '../theme';

const KeyMetricsCards = () => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Leads Enriched */}
      <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: theme.palette.background.default, borderColor: theme.palette.divider }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
            Total Leads Uploaded
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
            Leads Scraped
          </h3>
          <Mail className="w-4 h-4" style={{ color: theme.palette.text.secondary }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
          5,100
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
          1,500
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
  );
};

export default KeyMetricsCards;

