import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../theme';

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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({
    file: '',
    source: '',
    campaignName: ''
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'completed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSource('');
      setCampaignName('');
      setSelectedFile(null);
      setErrors({ file: '', source: '', campaignName: '' });
      setIsDragging(false);
      setImportProgress(0);
      setImportStatus('idle');
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  // Handle import progress
  useEffect(() => {
    if (importStatus === 'importing') {
      const duration = 10000; // 10 seconds
      const interval = 100; // Update every 100ms for smooth animation
      const increment = (100 / duration) * interval;
      
      progressIntervalRef.current = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setImportStatus('completed');
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    }
  }, [importStatus]);

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
    
    // If no errors, start import process
    if (!newErrors.file && !newErrors.source && !newErrors.campaignName && selectedFile) {
      setImportStatus('importing');
      setImportProgress(0);
      // Call the onImport callback (parent can handle actual import logic)
      onImport(selectedFile, source.trim(), campaignName.trim());
    }
  };

  const handleGoToCampaign = () => {
    // Store campaign data in localStorage for the campaign details page
    // This will be populated after import completes
    const tempId = `import-${Date.now()}`;
    const campaignData = {
      campaignName: campaignName || 'New Campaign',
      spreadsheetId: tempId, // Temporary ID until actual import completes
      source: source,
      isNewImport: true
    };
    localStorage.setItem('campaignData', JSON.stringify(campaignData));
    onClose();
    navigate(`/dashboard/campaigndetails/${tempId}`);
  };

  // Check if form is valid (all required fields filled)
  const isFormValid = selectedFile !== null && source.trim() !== '' && campaignName.trim() !== '';

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity" 
        aria-hidden="true"
        onClick={importStatus === 'idle' ? onClose : undefined}
        style={{ cursor: importStatus === 'idle' ? 'pointer' : 'default' }}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 relative">
        {/* Modal panel */}
        <div 
          className="rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg relative z-10"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          <div className="px-6 pt-6 pb-4" style={{ backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium" style={{ color: theme.palette.text.primary }}>
                {importStatus === 'completed' ? 'Import Complete' : importStatus === 'importing' ? 'Importing Data' : 'Import New Lead List'}
              </h3>
              {importStatus === 'idle' && (
                <button 
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-full p-1 transition-colors"
                  style={{ 
                    color: isLoading ? theme.palette.text.disabled : theme.palette.text.secondary
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Progress View */}
            {importStatus === 'importing' && (
              <div className="mb-6">
                <div className="mb-4">
                  <p className="text-sm mb-2" style={{ color: theme.palette.text.secondary }}>
                    Importing data...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5" style={{ backgroundColor: theme.palette.divider }}>
                    <div
                      className="h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${importProgress}%`,
                        backgroundColor: theme.palette.primary.main
                      }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-right" style={{ color: theme.palette.text.secondary }}>
                    {Math.round(importProgress)}%
                  </p>
                </div>
              </div>
            )}

            {/* Success View */}
            {importStatus === 'completed' && (
              <div className="mb-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle2 className="h-16 w-16 mb-4" style={{ color: theme.palette.success.main }} />
                  <p className="text-base font-medium mb-2" style={{ color: theme.palette.text.primary }}>
                    97 entries found, 3 duplicated removed
                  </p>
                </div>
              </div>
            )}
            
            {/* Form View */}
            {importStatus === 'idle' && (
              <form onSubmit={handleSubmit}>
              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleSelectFile}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: isDragging 
                      ? theme.palette.primary.main 
                      : selectedFile 
                        ? theme.palette.success.main 
                        : theme.palette.divider,
                    backgroundColor: isDragging 
                      ? theme.palette.primary.light 
                      : selectedFile 
                        ? `${theme.palette.success.main}15` 
                        : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDragging && !selectedFile) {
                      e.currentTarget.style.borderColor = theme.palette.text.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDragging && !selectedFile) {
                      e.currentTarget.style.borderColor = theme.palette.divider;
                    }
                  }}
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
                    <Upload className="h-12 w-12 mb-4" style={{ color: theme.palette.text.disabled }} />
                    <p className="mb-4" style={{ color: theme.palette.text.secondary }}>
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
                      className="px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                      style={{
                        backgroundColor: isLoading ? theme.palette.primary.light : theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        border: 'none',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                        }
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                        }
                      }}
                    >
                      or Select File
                    </button>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>{errors.file}</p>
                )}
              </div>

              {/* Source Input */}
              <div className="mb-6">
                <label htmlFor="source" className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.primary }}>
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none disabled:opacity-50"
                  style={{
                    borderColor: errors.source ? theme.palette.error.main : theme.palette.divider,
                    backgroundColor: isLoading ? theme.palette.background.paper : theme.palette.background.default,
                    color: theme.palette.text.primary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.palette.primary.main;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.source ? theme.palette.error.main : theme.palette.divider;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <p className="mt-1 text-xs" style={{ color: theme.palette.text.secondary }}>
                  Add a short description about the Source of these leads, this will be the identifier
                </p>
                {errors.source && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>{errors.source}</p>
                )}
              </div>

              {/* Campaign Name Input */}
              <div className="mb-6">
                <label htmlFor="campaignName" className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.primary }}>
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none disabled:opacity-50"
                  style={{
                    borderColor: errors.campaignName ? theme.palette.error.main : theme.palette.divider,
                    backgroundColor: isLoading ? theme.palette.background.paper : theme.palette.background.default,
                    color: theme.palette.text.primary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.palette.primary.main;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.campaignName ? theme.palette.error.main : theme.palette.divider;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.campaignName && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>{errors.campaignName}</p>
                )}
              </div>
            </form>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-4 sm:flex sm:flex-row-reverse" style={{ backgroundColor: theme.palette.background.paper }}>
            {importStatus === 'completed' ? (
              <button
                type="button"
                onClick={handleGoToCampaign}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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
                Take me to campaign
              </button>
            ) : importStatus === 'importing' ? (
              <div className="w-full text-center">
                <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                  Please wait while we import your data...
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !isFormValid}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{
                    backgroundColor: (isLoading || !isFormValid) ? theme.palette.primary.light : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                    }
                  }}
                >
                  {isLoading ? 'Importing...' : 'Import Leads'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  style={{
                    borderColor: theme.palette.divider,
                    backgroundColor: isLoading ? theme.palette.background.paper : theme.palette.background.default,
                    color: isLoading ? theme.palette.text.disabled : theme.palette.text.primary
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = theme.palette.background.default;
                    }
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal at document body level to ensure it's above everything including sidebar
  return createPortal(modalContent, document.body);
};

export default ImportLeadListModal;

