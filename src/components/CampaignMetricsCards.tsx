import { Users, Search, Mail, Eye } from 'lucide-react';

interface CampaignMetricsCardsProps {
  totalLeads: number;
  readyLeads: number;
  invalidLeads: number;
  scrapingProgress: number;
  emailsGenerated: number;
  openRate: number;
  replies: number;
}

const CampaignMetricsCards = ({
  totalLeads,
  readyLeads,
  invalidLeads,
  scrapingProgress,
  emailsGenerated,
  openRate,
  replies
}: CampaignMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Leads */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{totalLeads}</p>
        <p className="text-sm text-gray-500">
          {readyLeads} Ready / {invalidLeads} Invalid
        </p>
      </div>

      {/* Scraping Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Scraping Status</h3>
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-2">{scrapingProgress}% Completed</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${scrapingProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Emails Generated */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Emails Generated</h3>
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{emailsGenerated}</p>
        <p className="text-sm text-gray-500">Drafts Ready to Review</p>
      </div>

      {/* Engagement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Engagement</h3>
          <Eye className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{openRate}% Open Rate</p>
        <p className="text-sm text-gray-500">{replies} Replies</p>
      </div>
    </div>
  );
};

export default CampaignMetricsCards;

