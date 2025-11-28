import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';

interface ImportLeadListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, source: string, campaignName: string) => void;
  isLoading?: boolean;
}

const ImportLeadListModal = ({
  isOpen,
  onClose,
  onImport,
  isLoading = false
}: ImportLeadListModalProps) => {
  const [source, setSource] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({
    file: '',
    source: '',
    campaignName: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSource('');
      setCampaignName('');
      setSelectedFile(null);
      setErrors({ file: '', source: '', campaignName: '' });
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrors(prev => ({ ...prev, file: 'Please upload a CSV file' }));
      return;
    }
    
    setSelectedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {
      file: '',
      source: '',
      campaignName: ''
    };
    
    if (!selectedFile) {
      newErrors.file = 'Please select a CSV file';
    }
    
    if (!source.trim()) {
      newErrors.source = 'Source is required';
    }
    
    if (!campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit
    if (!newErrors.file && !newErrors.source && !newErrors.campaignName && selectedFile) {
      onImport(selectedFile, source.trim(), campaignName.trim());
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity" 
        aria-hidden="true"
        onClick={onClose}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 relative">
        {/* Modal panel */}
        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg relative z-10">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Import New Lead List</h3>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className={`rounded-full p-1 ${isLoading ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleSelectFile}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : selectedFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      {selectedFile 
                        ? selectedFile.name 
                        : 'Drag & Drop your CSV file here'}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFile();
                      }}
                      disabled={isLoading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      or Select File
                    </button>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-1 text-xs text-red-600">{errors.file}</p>
                )}
              </div>

              {/* Source Input */}
              <div className="mb-6">
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  id="source"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setErrors(prev => ({ ...prev, source: '' }));
                  }}
                  disabled={isLoading}
                  placeholder="Enter source"
                  className={`w-full px-3 py-2 border ${errors.source ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add a short description about the Source of these leads, this will be the identifier
                </p>
                {errors.source && (
                  <p className="mt-1 text-xs text-red-600">{errors.source}</p>
                )}
              </div>

              {/* Campaign Name Input */}
              <div className="mb-6">
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => {
                    setCampaignName(e.target.value);
                    setErrors(prev => ({ ...prev, campaignName: '' }));
                  }}
                  disabled={isLoading}
                  placeholder="Give Campaign Name"
                  className={`w-full px-3 py-2 border ${errors.campaignName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100`}
                />
                {errors.campaignName && (
                  <p className="mt-1 text-xs text-red-600">{errors.campaignName}</p>
                )}
              </div>
            </form>
          </div>
          
          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Importing...' : 'Import Leads'}
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

  // Render modal using portal at document body level to ensure it's above everything including sidebar
  return createPortal(modalContent, document.body);
};

export default ImportLeadListModal;

