import { Upload, ArrowRight, Database } from 'lucide-react';

const ConnectPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Data Source
          </h1>
          <p className="text-lg text-gray-600">
            Start enriching your leads by connecting your data source. We support multiple integration options.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <Upload className="h-8 w-8 text-indigo-600" />
              <h2 className="text-xl font-semibold ml-3">Upload CSV</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Upload your CSV file containing lead information for instant enrichment
            </p>
            <button className="flex items-center text-indigo-600 hover:text-indigo-700">
              Upload File
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-indigo-600" />
              <h2 className="text-xl font-semibold ml-3">API Integration</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Connect directly to your CRM or database for automated enrichment
            </p>
            <button className="flex items-center text-indigo-600 hover:text-indigo-700">
              Connect API
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            Need Help Getting Started?
          </h3>
          <p className="text-indigo-700">
            Our team is here to help you set up your integration. Schedule a call with our experts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;