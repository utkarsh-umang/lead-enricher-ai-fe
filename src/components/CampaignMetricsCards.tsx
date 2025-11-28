import { Users, Search, Mail, Clock, PlayCircle } from 'lucide-react';
import { useTheme } from '../theme';

interface CampaignMetricsCardsProps {
  totalLeads: number;
  scrapingProgress: number;
  isScrapingConfigured: boolean;
  isEmailGenerationConfigured: boolean;
  estimatedTimeLeft?: string; 
  onConfigureScraping: () => void;
  onConfigureEmailGeneration: () => void;
}

const CampaignMetricsCards = ({
  totalLeads,
  scrapingProgress,
  isScrapingConfigured,
  isEmailGenerationConfigured,
  estimatedTimeLeft,
  onConfigureScraping,
  onConfigureEmailGeneration
}: CampaignMetricsCardsProps) => {
  const { theme } = useTheme();
  const showEstimatedTime = isScrapingConfigured && isEmailGenerationConfigured;
  const gridCols = showEstimatedTime ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6 mb-8`}>
      {/* Card 1: Total Leads */}
      <div 
        className="rounded-lg shadow-sm p-6"
        style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 
            className="text-sm font-medium"
            style={{ color: theme.palette.text.secondary }}
          >
            Total Leads
          </h3>
          <Users 
            className="h-5 w-5" 
            style={{ color: theme.palette.text.secondary }}
          />
        </div>
        <p 
          className="text-3xl font-bold"
          style={{ color: theme.palette.text.primary }}
        >
          {totalLeads}
        </p>
      </div>

      {/* Card 2: Scraping Percentage */}
      <div 
        className="rounded-lg shadow-sm p-6"
        style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 
            className="text-sm font-medium"
            style={{ color: theme.palette.text.secondary }}
          >
            Scraping Progress
          </h3>
          <Search 
            className="h-5 w-5" 
            style={{ color: theme.palette.text.secondary }}
          />
        </div>
        {scrapingProgress === 0 ? (
          <div className="mt-4">
            <button
              onClick={onConfigureScraping}
              className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
              <PlayCircle className="h-4 w-4 mr-2" />
              Configure and Start Scraping
            </button>
          </div>
        ) : (
          <>
            <p 
              className="text-3xl font-bold mb-2"
              style={{ color: theme.palette.text.primary }}
            >
              {scrapingProgress}%
            </p>
            <div 
              className="w-full rounded-full h-2"
              style={{ backgroundColor: theme.palette.divider }}
            >
              <div
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${scrapingProgress}%`,
                  backgroundColor: theme.palette.info.main
                }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Card 3: Configure and Start Email Generation */}
      <div 
        className="rounded-lg shadow-sm p-6"
        style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 
            className="text-sm font-medium"
            style={{ color: theme.palette.text.secondary }}
          >
            Email Generation
          </h3>
          <Mail 
            className="h-5 w-5" 
            style={{ color: theme.palette.text.secondary }}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={onConfigureEmailGeneration}
            disabled={!isScrapingConfigured}
            className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={
              !isScrapingConfigured
                ? {
                    backgroundColor: theme.palette.divider,
                    color: theme.palette.text.disabled,
                    cursor: 'not-allowed'
                  }
                : {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
            }
            onMouseEnter={(e) => {
              if (isScrapingConfigured) {
                e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
              }
            }}
            onMouseLeave={(e) => {
              if (isScrapingConfigured) {
                e.currentTarget.style.backgroundColor = theme.palette.primary.main;
              }
            }}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Configure and Start Email Generation
          </button>
        </div>
      </div>

      {/* Card 4: Estimated Time Left - Only shown after both are configured */}
      {showEstimatedTime && (
        <div 
          className="rounded-lg shadow-sm p-6"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 
              className="text-sm font-medium"
              style={{ color: theme.palette.text.secondary }}
            >
              Estimated Time Left
            </h3>
            <Clock 
              className="h-5 w-5" 
              style={{ color: theme.palette.text.secondary }}
            />
          </div>
          <p 
            className="text-3xl font-bold mt-2"
            style={{ color: theme.palette.text.primary }}
          >
            {estimatedTimeLeft || 'Calculating...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignMetricsCards;

