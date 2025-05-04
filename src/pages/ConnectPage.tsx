//@ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Timer, 
  ArrowRight,
  CopyCheck,
  FileText,
  Loader,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { verifyGoogleSheetAccess, ValidationResult } from '../services/sheetService';

const ConnectPage = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const navigate = useNavigate();
  
  const serviceEmail = 'umang-utk@url-to-email-445616.iam.gserviceaccount.com';
  const templateSheetUrl = 'https://docs.google.com/spreadsheets/d/1otxt0-_eE31xDV_G4vfsnTyq0aiZef4VdWoKJRNU-2c/edit?usp=sharing';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(serviceEmail);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  // Handle URL validation using the fetch API service
  const handleValidateUrl = async () => {
    if (!sheetUrl.trim()) {
      setValidationResult({
        accessible: false,
        error: 'Please enter a Google Sheet URL',
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Call our API service function that uses fetch
      const result = await verifyGoogleSheetAccess(sheetUrl);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        accessible: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
  };

  // Handler to redirect to SheetDetailsPage with URL change
  const handleContinueToEnrichment = () => {
    if (validationResult && validationResult.accessible) {
      // Store validation data in localStorage
      localStorage.setItem('sheetDetails', JSON.stringify({
        spreadsheetId: validationResult.spreadsheet_id,
        sheetTitle: validationResult.title,
        sheetNames: validationResult.sheet_names
      }));
      
      // Redirect to the sheet details page
      navigate('/sheet-details');
    }
  };
  
  // Handler to navigate back to connected sheets list
  const handleViewAllSheets = () => {
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back to sheets button */}
      <div className="mb-8">
        <button
          onClick={handleViewAllSheets}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Connected Sheets
        </button>
      </div>
      
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Connect Your Lead List
        </h1>
        <p className="text-lg text-gray-600">
          Make a copy of our template lead list sheet, fill it with your leads, and share the sheet for AI-powered enrichment.
        </p>
      </div>

      {/* Template Copy Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Copy Template</h2>
            <p className="text-gray-600 mb-4">
              Start with our pre-formatted template to ensure your lead list includes all necessary fields
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Person Name</li>
              <li>Person Linkedin URL</li>
              <li>Company Website</li>
            </ul>
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <CopyCheck className="h-5 w-5 mr-2" />
                Copy Template
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Template Google Sheet
                </Dialog.Title>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Follow these steps to use our template:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-gray-600 mb-6">
                    <li>Click the link below to open our template</li>
                    <li className="flex items-start">
                      <span className="mr-2">Once the sheet opens, select</span>
                      <div className="flex items-center px-2 py-1 bg-gray-100 rounded text-sm">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>File</span>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>Make a copy</span>
                      </div>
                    </li>
                    <li>Fill your copy with your lead data</li>
                    <li>Share your filled copy with our service account (step 2 below)</li>
                  </ol>
                  <a 
                    href={templateSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Open Template Sheet
                  </a>
                </div>
                <Dialog.Close asChild>
                  <button className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mt-4">
                    Close
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* Google Sheet Connection Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Connect Google Sheet</h2>
        
        <div className="space-y-6">
          {/* Step 1: Share Sheet */}
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

          {/* Step 2: Validate URL - This is where our API integration happens */}
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
                <div>
                  {/* Text input for Google Sheet URL */}
                  <textarea
                    value={sheetUrl}
                    onChange={(e) => {
                      setSheetUrl(e.target.value);
                      resetValidation();
                    }}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className={clsx(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500",
                      validationResult && !validationResult.accessible
                        ? "border-red-300 focus:border-red-500" 
                        : validationResult && validationResult.accessible
                        ? "border-green-300 focus:border-green-500"
                        : "border-gray-300 focus:border-indigo-500"
                    )}
                    rows={3}
                  />

                  {/* Validation result messages */}
                  {validationResult && (
                    <div 
                      className={clsx(
                        "mt-2 text-sm flex items-start space-x-2",
                        validationResult.accessible ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {validationResult.accessible ? (
                        <CheckSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      )}
                      <span>
                        {validationResult.accessible 
                          ? "Successfully connected to the Google Sheet" 
                          : validationResult.error}
                      </span>
                    </div>
                  )}

                  {/* Show sheet title on successful validation */}
                  {validationResult && validationResult.accessible && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-green-800">
                      <p className="font-medium">Connected to sheet:</p>
                      <p className="text-green-700">{validationResult.title}</p>
                      {validationResult.sheet_names.length > 0 && (
                        <p className="text-green-700 text-sm mt-1">
                          Available sheets: {validationResult.sheet_names.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Validate URL button - calls our API service */}
                {!validationResult && <button 
                  onClick={handleValidateUrl}
                  disabled={isValidating || !sheetUrl.trim()}
                  className={clsx(
                    "flex items-center px-4 py-2 rounded-lg",
                    (isValidating || !sheetUrl.trim()) 
                      ? "bg-indigo-300 text-white cursor-not-allowed" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  {isValidating ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Validate Connection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>}

                {/* Actions after successful validation */}
                {validationResult && validationResult.accessible && (
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={handleContinueToEnrichment}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Get Sheet Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={handleViewAllSheets}
                      className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                    >
                      View All Sheets
                    </button>
                  </div>
                )}
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
  );
};

export default ConnectPage;