import React, { useState, useRef } from 'react';
import Header from '../../components/Header/Header';
import ActionButton from '../../components/ActionButton/ActionButton';
import './Upload.css';

interface EnrichmentOption {
  id: string;
  label: string;
  checked: boolean;
}

const UploadView: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchName, setBatchName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const [enrichmentOptions, setEnrichmentOptions] = useState<EnrichmentOption[]>([
    { id: 'company', label: 'Company Profile Enrichment', checked: false },
    { id: 'ebook', label: 'eBook Discovery', checked: false },
    { id: 'linkedin', label: 'LinkedIn Content', checked: false },
    { id: 'blog', label: 'Blog Content', checked: false },
    { id: 'website', label: 'Website Content', checked: false },
    { id: 'testimonials', label: 'Testimonials & Reviews', checked: false },
    { id: 'webinar', label: 'Webinar/Events', checked: false },
  ]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'text/csv', 
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.type)) {
      setFile(file);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleOption = (id: string) => {
    setEnrichmentOptions(options => 
      options.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const handleStartProcessing = () => {
    if (!file) {
      alert('Please upload a file');
      return;
    }

    if (!batchName.trim()) {
      alert('Please enter a batch name');
      return;
    }

    if (!enrichmentOptions.some(option => option.checked)) {
      alert('Please select at least one enrichment option');
      return;
    }

    console.log({
      file,
      batchName,
      enrichmentOptions: enrichmentOptions.filter(o => o.checked).map(o => o.id)
    });
    
    // In a real app, you would send this data to your API
    alert('Processing started!');
  };

  return (
    <div className="upload-view">
      <Header title="Upload Leads List" />
      
      <div className="upload-container">
        <div className="upload-card">
          <h2 className="upload-title">Upload Lead List</h2>
          
          {/* File Upload Area */}
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Drag and drop your CSV/Excel file</p>
            <p className="or-divider">or</p>
            <ActionButton 
              label="Browse Files" 
              onClick={handleBrowseClick} 
              variant="primary"
            />
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              accept=".csv,.xls,.xlsx"
            />
          </div>
          
          {/* File Display */}
          {file && (
            <div className="selected-file">
              Selected: {file.name}
            </div>
          )}
          
          {/* Enrichment Options */}
          <div className="options-section">
            <h3>Enrichment Options</h3>
            <div className="options-grid">
              {enrichmentOptions.slice(0, 4).map(option => (
                <div className="option-item" key={option.id}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => toggleOption(option.id)}
                    />
                    <span className="checkbox-label">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="options-grid">
              {enrichmentOptions.slice(4).map(option => (
                <div className="option-item" key={option.id}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => toggleOption(option.id)}
                    />
                    <span className="checkbox-label">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Batch Name */}
          <div className="batch-name-section">
            <label htmlFor="batchName">Batch Name</label>
            <input
              type="text"
              id="batchName"
              className="batch-name-input"
              placeholder="Enter a name for this batch"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>
        </div>
        
        {/* Process Button */}
        <div className="process-button-container">
          <ActionButton 
            label="Start Processing" 
            onClick={handleStartProcessing} 
            variant="success"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default UploadView;