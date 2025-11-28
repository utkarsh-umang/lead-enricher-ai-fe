import { Users, Search, Mail, Clock, PlayCircle } from 'lucide-react';

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
  const showEstimatedTime = isScrapingConfigured && isEmailGenerationConfigured;
  const gridCols = showEstimatedTime ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6 mb-8`}>
      {/* Card 1: Total Leads */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
      </div>

      {/* Card 2: Scraping Percentage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Scraping Progress</h3>
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {scrapingProgress === 0 ? (
          <div className="mt-4">
            <button
              onClick={onConfigureScraping}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Configure and Start Scraping
            </button>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold text-gray-900 mb-2">{scrapingProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${scrapingProgress}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Card 3: Configure and Start Email Generation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Email Generation</h3>
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-4">
          <button
            onClick={onConfigureEmailGeneration}
            disabled={!isScrapingConfigured}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isScrapingConfigured
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Configure and Start Email Generation
          </button>
        </div>
      </div>

      {/* Card 4: Estimated Time Left - Only shown after both are configured */}
      {showEstimatedTime && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Estimated Time Left</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {estimatedTimeLeft || 'Calculating...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignMetricsCards;

