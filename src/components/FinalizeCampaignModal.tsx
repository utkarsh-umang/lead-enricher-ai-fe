import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PlayCircle, Check } from 'lucide-react';
import { useTheme } from '../theme';

interface EmailDraft {
  id: number;
  name: string;
  subject: string;
  preview: string;
  content: string;
}

interface FinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinalize: (campaignName: string, templateName: string, subject: string, content: string) => void;
  isLoading: boolean;
  defaultTemplateName?: string;
  selectedDraft?: EmailDraft | null;
}

const FinalizeModal = ({
  isOpen,
  onClose,
  onFinalize,
  isLoading,
  defaultTemplateName = '',
  selectedDraft = null
}: FinalizeModalProps) => {
  const { theme } = useTheme();
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({
    templateName: '',
    subject: '',
    content: ''
  });

  // Set default template name and draft content when modal opens
  useEffect(() => {
    if (isOpen) {
      if (defaultTemplateName) {
      setTemplateName(`${defaultTemplateName} - Final`);
      }
      if (selectedDraft) {
        setSubject(selectedDraft.subject);
        setContent(selectedDraft.content);
      }
    }
  }, [isOpen, defaultTemplateName, selectedDraft]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTemplateName('');
      setSubject('');
      setContent('');
      setErrors({ templateName: '', subject: '', content: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {
      campaignName: '',
      templateName: '',
      subject: '',
      content: ''
    };
    
    if (!templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Email content is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit
    if (!newErrors.templateName && !newErrors.subject && !newErrors.content) {
      onFinalize('', templateName, subject, content);
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
        <div 
          className="rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-5xl relative z-10 max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: theme.palette.background.default }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4" style={{ backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.palette.text.primary }}>
                Review & Finalize
              </h3>
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
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {/* Step 1: Define Strategy */}
                <div className="flex items-center flex-1">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full mr-2"
                    style={{ 
                      backgroundColor: theme.palette.success.main,
                      color: theme.palette.text.primary
                    }}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    1. Define Strategy
                  </span>
                  <div 
                    className="flex-1 h-1 mx-4 rounded-full"
                    style={{ backgroundColor: theme.palette.divider }}
                  />
                </div>

                {/* Step 2: Generate Drafts */}
                <div className="flex items-center flex-1">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full mr-2"
                    style={{ 
                      backgroundColor: theme.palette.success.main,
                      color: theme.palette.text.primary
                    }}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    2. Generate Drafts
                  </span>
                  <div 
                    className="flex-1 h-1 mx-4 rounded-full"
                    style={{ backgroundColor: theme.palette.divider }}
                  />
                </div>

                {/* Step 3: Review & Finalize */}
                <div className="flex items-center">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full mr-2"
                    style={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    3. Review & Finalize
                  </span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Template Name */}
              <div className="mb-6">
                <label 
                  htmlFor="templateName" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Template Name*
                </label>
                <input
                  type="text"
                  id="templateName"
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value);
                    if (errors.templateName) {
                      setErrors({ ...errors, templateName: '' });
                    }
                  }}
                  disabled={isLoading}
                  placeholder="e.g., Real Estate Template Final"
                  className="w-full px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
                  style={{
                    borderColor: errors.templateName ? theme.palette.error.main : theme.palette.divider,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                  onFocus={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = theme.palette.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.templateName ? theme.palette.error.main : theme.palette.divider;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.templateName && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>
                    {errors.templateName}
                  </p>
                )}
              </div>

              {/* Subject Line */}
              <div className="mb-6">
                <label 
                  htmlFor="subject" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Email Subject*
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) {
                      setErrors({ ...errors, subject: '' });
                    }
                  }}
                  disabled={isLoading}
                  placeholder="Enter email subject line"
                  className="w-full px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
                  style={{
                    borderColor: errors.subject ? theme.palette.error.main : theme.palette.divider,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                  onFocus={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = theme.palette.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.subject ? theme.palette.error.main : theme.palette.divider;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Email Content */}
              <div className="mb-6">
                <label 
                  htmlFor="content" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Email Content*
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) {
                      setErrors({ ...errors, content: '' });
                    }
                  }}
                  disabled={isLoading}
                  rows={12}
                  placeholder="Enter email content"
                  className="w-full px-4 py-3 rounded-md resize-none focus:outline-none disabled:opacity-50"
                  style={{
                    borderColor: errors.content ? theme.palette.error.main : theme.palette.divider,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    fontFamily: 'monospace'
                  }}
                  onFocus={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = theme.palette.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.content ? theme.palette.error.main : theme.palette.divider;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.content && (
                  <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>
                    {errors.content}
                  </p>
                )}
              </div>
            </form>
          </div>
          
          {/* Footer Actions */}
          <div 
            className="px-6 py-4 flex items-center justify-end gap-3"
            style={{ 
              backgroundColor: theme.palette.background.paper,
              borderTopColor: theme.palette.divider,
              borderTopWidth: '1px',
              borderTopStyle: 'solid'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 focus:outline-none"
              style={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: theme.palette.text.primary,
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.background.default;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.background.paper;
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              style={
                isLoading
                  ? {
                      backgroundColor: theme.palette.divider,
                      color: theme.palette.text.disabled,
                      outline: 'none'
                    }
                  : {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      outline: 'none'
                    }
              }
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2 inline" />
                  Start Email Generation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal at document body level
  return createPortal(modalContent, document.body);
};

export default FinalizeModal;