import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { useTheme } from '../theme';

interface EmailDraft {
  id: number;
  name: string;
  subject: string;
  preview: string;
  content: string;
}

interface ReviewDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (selectedDraft: EmailDraft) => void;
  onBack: () => void;
  drafts: EmailDraft[];
}

const ReviewDraftsModal = ({
  isOpen,
  onClose,
  onContinue,
  onBack,
  drafts
}: ReviewDraftsModalProps) => {
  const { theme } = useTheme();
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);

  // Initialize selected draft to the first one
  useEffect(() => {
    if (isOpen && drafts.length > 0 && selectedDraftId === null) {
      setSelectedDraftId(drafts[0].id);
    }
  }, [isOpen, drafts, selectedDraftId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDraftId(null);
    }
  }, [isOpen]);

  const handleSelectDraft = (draftId: number) => {
    setSelectedDraftId(draftId);
  };

  const handleContinue = () => {
    if (selectedDraftId !== null) {
      const selectedDraft = drafts.find(d => d.id === selectedDraftId);
      if (selectedDraft) {
        onContinue(selectedDraft);
      }
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
          className="rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-7xl relative z-10 max-h-[90vh] flex flex-col"
          style={{ backgroundColor: theme.palette.background.default }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable content area */}
          <div className="px-6 pt-6 pb-4 overflow-y-auto flex-1" style={{ backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.palette.text.primary }}>
                Review Generated Drafts
              </h3>
              <button 
                onClick={onClose}
                className="rounded-full p-1 transition-colors"
                style={{ color: theme.palette.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.palette.background.paper;
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
                      backgroundColor: theme.palette.divider,
                      color: theme.palette.text.disabled
                    }}
                  >
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    3. Review & Finalize
                  </span>
                </div>
              </div>
            </div>

            {/* Draft Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {drafts.map((draft) => {
                const isSelected = selectedDraftId === draft.id;

                return (
                  <div
                    key={draft.id}
                    className="rounded-lg p-6 transition-all cursor-pointer"
                    style={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
                      borderWidth: isSelected ? '2px' : '1px',
                      borderStyle: 'solid',
                      boxShadow: isSelected ? `0 4px 12px ${theme.palette.primary.main}30` : 'none'
                    }}
                    onClick={() => handleSelectDraft(draft.id)}
                  >
                    {/* Draft Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 
                          className="text-lg font-semibold"
                          style={{ color: theme.palette.text.primary }}
                        >
                          {draft.name}
                        </h4>
                        {isSelected && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText
                            }}
                          >
                            Selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="mb-4">
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.palette.text.secondary }}
                      >
                        Subject
                      </label>
                      <p 
                        className="font-medium"
                        style={{ color: theme.palette.text.primary }}
                      >
                        {draft.subject}
                      </p>
                    </div>

                    {/* Preview Text */}
                    <div className="mb-4">
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.palette.text.secondary }}
                      >
                        Preview Text
                      </label>
                      <p 
                        className="text-sm whitespace-pre-wrap line-clamp-3"
                        style={{ color: theme.palette.text.secondary }}
                      >
                        {draft.preview}
                      </p>
                    </div>

                    {/* Select Button */}
                    <div className="mt-4 pt-4 border-t"
                      style={{ borderColor: theme.palette.divider }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDraft(draft.id);
                        }}
                        className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        style={
                          isSelected
                            ? {
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                cursor: 'default'
                              }
                            : {
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText
                              }
                        }
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.opacity = '0.9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.opacity = '1';
                          }
                        }}
                      >
                        {isSelected ? 'Selected Draft' : 'Select Draft'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div 
            className="px-6 py-4 flex items-center justify-between flex-shrink-0"
            style={{ 
              backgroundColor: theme.palette.background.paper,
              borderTopColor: theme.palette.divider,
              borderTopWidth: '1px',
              borderTopStyle: 'solid'
            }}
          >
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: theme.palette.text.primary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.background.default;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.background.paper;
              }}
            >
              Back to Strategy
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedDraftId === null}
              className="px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                selectedDraftId === null
                  ? {
                      backgroundColor: theme.palette.divider,
                      color: theme.palette.text.disabled
                    }
                  : {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }
              }
              onMouseEnter={(e) => {
                if (selectedDraftId !== null) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDraftId !== null) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              Continue to Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal at document body level
  return createPortal(modalContent, document.body);
};

export default ReviewDraftsModal;

