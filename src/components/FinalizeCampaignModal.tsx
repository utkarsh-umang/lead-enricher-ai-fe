import { useState, useEffect } from 'react';
import { X, PlayCircle } from 'lucide-react';

interface FinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinalize: (campaignName: string, templateName: string) => void;
  isLoading: boolean;
  defaultTemplateName?: string;
}

const FinalizeModal = ({
  isOpen,
  onClose,
  onFinalize,
  isLoading,
  defaultTemplateName = ''
}: FinalizeModalProps) => {
  const [campaignName, setCampaignName] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [errors, setErrors] = useState({
    campaignName: '',
    templateName: ''
  });

  // Set default template name when modal opens
  useEffect(() => {
    if (isOpen && defaultTemplateName) {
      setTemplateName(`${defaultTemplateName} - Final`);
    }
  }, [isOpen, defaultTemplateName]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCampaignName('');
      setTemplateName('');
      setErrors({ campaignName: '', templateName: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {
      campaignName: '',
      templateName: ''
    };
    
    if (!campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    }
    
    if (!templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit
    if (!newErrors.campaignName && !newErrors.templateName) {
      onFinalize(campaignName, templateName);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Finalize Campaign</h3>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className={`rounded-full p-1 ${isLoading ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Your campaign will start once finalized. This action cannot be undone.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name*
                </label>
                <input
                  type="text"
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., Real Estate Outreach May 2025"
                  className={`w-full px-3 py-2 border ${errors.campaignName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.campaignName && (
                  <p className="mt-1 text-xs text-red-600">{errors.campaignName}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name*
                </label>
                <input
                  type="text"
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., Real Estate Template Final"
                  className={`w-full px-3 py-2 border ${errors.templateName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.templateName && (
                  <p className="mt-1 text-xs text-red-600">{errors.templateName}</p>
                )}
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalizing...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Start Campaign
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${
                isLoading ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
              } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeModal;