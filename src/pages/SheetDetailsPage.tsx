import { FileSpreadsheet, Play, CheckCircle2 } from 'lucide-react';

const SheetDetailsPage = () => {
  const handleStartWorkflow = () => {
    // This will be connected to the API later
    console.log('Starting workflow...');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Lead List Details
                </h1>
                <p className="text-gray-600">
                  Connected Google Sheet information and workflow controls
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Connected</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Sheet Name</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  Q1 2024 Lead List
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  March 15, 2024 at 2:30 PM
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Leads</dt>
                <dd className="mt-1 text-lg text-gray-900">250</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sheet URL</dt>
                <dd className="mt-1 text-sm text-gray-600 break-all">
                  https://docs.google.com/spreadsheets/d/example-sheet-id/edit
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Enrichment Workflow
                </h2>
                <p className="text-gray-600 mt-1">
                  Start the AI-powered enrichment process for your lead list
                </p>
              </div>
              <button
                onClick={handleStartWorkflow}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetDetailsPage;