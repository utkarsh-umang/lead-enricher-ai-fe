import { LayoutGrid, PlusCircle } from 'lucide-react';

const CampaignsPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Campaigns
        </h1>
        <p className="text-lg text-gray-600">
          Create and manage your outreach campaigns
        </p>
      </div>
      
      {/* Empty state - this is a placeholder for future implementation */}
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-4 text-xl font-medium text-gray-900">No campaigns created yet</h3>
        <p className="mt-2 text-gray-600">Start creating your first outreach campaign</p>
        <button
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Campaign
        </button>
      </div>
      
      {/* Information card */}
      <div className="bg-indigo-50 p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Coming Soon</h2>
        <p className="text-indigo-700">
          The campaigns feature is coming soon. You'll be able to create and manage automated
          outreach campaigns using your enriched lead data.
        </p>
      </div>
    </div>
  );
};

export default CampaignsPage;