import { useState } from 'react';
import { Download, FileSpreadsheet, Copy, CheckCircle, ExternalLink, Timer, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';

const ConnectPage = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const serviceEmail = 'leads-enrichment@service-account.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(serviceEmail);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would trigger a template file download
    console.log('Downloading template...');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Lead List
          </h1>
          <p className="text-lg text-gray-600">
            Download our template, fill it with your leads, and connect via Google Sheets for AI-powered enrichment.
          </p>
        </div>

        {/* Template Download Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Download Template</h2>
              <p className="text-gray-600 mb-4">
                Start with our pre-formatted template to ensure your lead list includes all necessary fields:
                company name, website, and contact information.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Company Name & Website</li>
                <li>Contact Person Details</li>
                <li>Company Size & Location</li>
              </ul>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Template
            </button>
          </div>
        </div>

        {/* Google Sheet Connection Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Connect Google Sheet</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Share your Google Sheet</h3>
                <p className="text-gray-600 mb-4">
                  First, share your Google Sheet with our service account
                </p>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
                      <FileSpreadsheet className="h-5 w-5 mr-2" />
                      Connect with Google Sheet
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md">
                      <Dialog.Title className="text-xl font-semibold mb-4">
                        Share Your Google Sheet
                      </Dialog.Title>
                      <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                          Share your Google Sheet with our service account:
                        </p>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <code className="text-sm flex-1">{serviceEmail}</code>
                          <button
                            onClick={handleCopyEmail}
                            className={clsx(
                              "p-2 rounded-md transition-colors",
                              isEmailCopied ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {isEmailCopied ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium">Steps to share:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Open your Google Sheet</li>
                          <li>Click the "Share" button in the top right</li>
                          <li>Paste the service email address</li>
                          <li>Set permission to "Editor"</li>
                          <li>Click "Done"</li>
                        </ol>
                      </div>
                      <Dialog.Close asChild>
                        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          I've Shared the Sheet
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">Paste Sheet URL</h3>
                <p className="text-gray-600 mb-4">
                  Copy your Google Sheet URL and paste it below
                </p>
                <div className="space-y-4">
                  <textarea
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Validate URL
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-indigo-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-6">What Happens Next?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <ExternalLink className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-indigo-900 mb-2">AI-Powered Enrichment</h3>
                <p className="text-indigo-700">
                  Our AI will analyze your leads and enrich them with additional data including
                  company size, industry, funding details, and more.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Timer className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-indigo-900 mb-2">Processing Time</h3>
                <p className="text-indigo-700">
                  Enrichment takes approximately 5-10 minutes per 100 leads. You'll receive a
                  notification when the process is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;