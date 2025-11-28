import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check, Rocket, Target, Annoyed } from 'lucide-react';
import { useTheme } from '../theme';

interface EmailGenerationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (offer: string, coreAngle: 'pain' | 'objective' | 'desire', toneOfVoice: string) => void;
  isLoading?: boolean;
}

type CoreAngle = 'pain' | 'objective' | 'desire';

const toneOfVoiceOptions = [
  'Professional & Direct',
  'Friendly & Conversational',
  'Casual & Approachable',
  'Formal & Corporate',
  'Enthusiastic & Energetic',
  'Empathetic & Understanding'
];

const EmailGenerationConfigModal = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading = false
}: EmailGenerationConfigModalProps) => {
  const { theme } = useTheme();
  const [offer, setOffer] = useState('');
  const [coreAngle, setCoreAngle] = useState<CoreAngle>('pain');
  const [toneOfVoice, setToneOfVoice] = useState(toneOfVoiceOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({ offer: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOffer('');
      setCoreAngle('pain');
      setToneOfVoice(toneOfVoiceOptions[0]);
      setIsDropdownOpen(false);
      setErrors({ offer: '' });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleGenerate = () => {
    // Validate inputs
    const newErrors = { offer: '' };
    
    if (!offer.trim()) {
      newErrors.offer = 'Offer description is required';
    }

    setErrors(newErrors);

    if (!newErrors.offer) {
      onGenerate(offer.trim(), coreAngle, toneOfVoice);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity" 
        aria-hidden="true"
        onClick={isLoading ? undefined : onClose}
        style={{ cursor: isLoading ? 'default' : 'pointer' }}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 relative">
        {/* Modal panel */}
        <div 
          className="rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-5xl relative z-10"
          style={{ backgroundColor: theme.palette.background.default }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4" style={{ backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.palette.text.primary }}>
                Email Generation Configuration
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
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Define Strategy
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
                      backgroundColor: theme.palette.divider,
                      color: theme.palette.text.disabled
                    }}
                  >
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Generate Drafts
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
                    Review & Finalize
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Section: What is your Offer? */}
              <div>
                <div 
                  className="rounded-lg p-6 h-full"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <h4 
                    className="text-base font-semibold mb-4"
                    style={{ color: theme.palette.text.primary }}
                  >
                    What is your Offer?
                  </h4>
                  <textarea
                    value={offer}
                    onChange={(e) => {
                      setOffer(e.target.value);
                      if (errors.offer) {
                        setErrors({ ...errors, offer: '' });
                      }
                    }}
                    disabled={isLoading}
                    placeholder="Describe your product, service, or offer. Be specific about the value proposition to maximize your promotion, communication, and usage and management..."
                    className="w-full h-64 px-4 py-3 rounded-md resize-none focus:outline-none focus:ring-2 disabled:opacity-50"
                    style={{
                      borderColor: errors.offer ? theme.palette.error.main : theme.palette.divider,
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
                      e.currentTarget.style.borderColor = errors.offer ? theme.palette.error.main : theme.palette.divider;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {errors.offer && (
                    <p className="mt-2 text-xs" style={{ color: theme.palette.error.main }}>
                      {errors.offer}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Section: Core Angle and Tone */}
              <div className="space-y-6">
                {/* Select Core Angle */}
                <div 
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <h4 
                    className="text-base font-semibold mb-4"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Select Core Angle
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Pain Option */}
                    <button
                      type="button"
                      onClick={() => !isLoading && setCoreAngle('pain')}
                      disabled={isLoading}
                      className="p-4 rounded-lg transition-all text-center focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        backgroundColor: coreAngle === 'pain' ? theme.palette.primary.light : 'transparent',
                        borderColor: coreAngle === 'pain' ? theme.palette.primary.main : theme.palette.divider,
                        borderWidth: coreAngle === 'pain' ? '3px' : '1px',
                        borderStyle: 'solid',
                        boxShadow: coreAngle === 'pain' ? `0 4px 12px ${theme.palette.primary.main}40` : 'none',
                        transform: coreAngle === 'pain' ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && coreAngle !== 'pain') {
                          e.currentTarget.style.backgroundColor = theme.palette.background.default;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && coreAngle !== 'pain') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#EF4444' }}
                        >
                          <Annoyed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div 
                            className="font-medium mb-1"
                            style={{ color: theme.palette.text.primary }}
                          >
                            Pain
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: theme.palette.text.secondary }}
                          >
                            Focus on problems they face.
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Objective Option */}
                    <button
                      type="button"
                      onClick={() => !isLoading && setCoreAngle('objective')}
                      disabled={isLoading}
                      className="p-4 rounded-lg transition-all text-center focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        backgroundColor: coreAngle === 'objective' ? theme.palette.primary.light : 'transparent',
                        borderColor: coreAngle === 'objective' ? theme.palette.primary.main : theme.palette.divider,
                        borderWidth: coreAngle === 'objective' ? '3px' : '1px',
                        borderStyle: 'solid',
                        boxShadow: coreAngle === 'objective' ? `0 4px 12px ${theme.palette.primary.main}40` : 'none',
                        transform: coreAngle === 'objective' ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && coreAngle !== 'objective') {
                          e.currentTarget.style.backgroundColor = theme.palette.background.default;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && coreAngle !== 'objective') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#3B82F6' }}
                        >
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div 
                            className="font-medium mb-1"
                            style={{ color: theme.palette.text.primary }}
                          >
                            Objective
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: theme.palette.text.secondary }}
                          >
                            Focus on goals they want to hit.
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Desire Option */}
                    <button
                      type="button"
                      onClick={() => !isLoading && setCoreAngle('desire')}
                      disabled={isLoading}
                      className="p-4 rounded-lg transition-all text-center focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        backgroundColor: coreAngle === 'desire' ? theme.palette.primary.light : 'transparent',
                        borderColor: coreAngle === 'desire' ? theme.palette.primary.main : theme.palette.divider,
                        borderWidth: coreAngle === 'desire' ? '3px' : '1px',
                        borderStyle: 'solid',
                        boxShadow: coreAngle === 'desire' ? `0 4px 12px ${theme.palette.primary.main}40` : 'none',
                        transform: coreAngle === 'desire' ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && coreAngle !== 'desire') {
                          e.currentTarget.style.backgroundColor = theme.palette.background.default;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && coreAngle !== 'desire') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#10B981' }}
                        >
                          <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div 
                            className="font-medium mb-1"
                            style={{ color: theme.palette.text.primary }}
                          >
                            Desire
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: theme.palette.text.secondary }}
                          >
                            Focus on the dream outcome.
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tone of Voice */}
                <div 
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <h4 
                    className="text-base font-semibold mb-4"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Tone of Voice
                  </h4>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-md flex items-center justify-between focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.borderColor = theme.palette.primary.main;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.borderColor = theme.palette.divider;
                        }
                      }}
                    >
                      <span>{toneOfVoice}</span>
                      <ChevronDown 
                        className="h-5 w-5 transition-transform"
                        style={{ 
                          color: theme.palette.text.secondary,
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    </button>
                    {isDropdownOpen && (
                      <div 
                        className="absolute z-10 w-full mb-1 bottom-full rounded-md shadow-lg"
                        style={{
                          backgroundColor: theme.palette.background.default,
                          borderColor: theme.palette.divider,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                      >
                        {toneOfVoiceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setToneOfVoice(option);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none"
                            style={{
                              color: theme.palette.text.primary,
                              backgroundColor: toneOfVoice === option ? theme.palette.background.paper : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = toneOfVoice === option ? theme.palette.background.paper : 'transparent';
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div 
            className="px-6 py-4"
            style={{ backgroundColor: theme.palette.background.paper }}
          >
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !offer.trim()}
              className="w-full py-4 rounded-md text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
              style={
                isLoading || !offer.trim()
                  ? {
                      backgroundColor: theme.palette.divider,
                      color: theme.palette.text.disabled,
                      cursor: 'not-allowed'
                    }
                  : {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }
              }
              onMouseEnter={(e) => {
                if (!isLoading && offer.trim()) {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && offer.trim()) {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 inline" style={{ color: theme.palette.primary.contrastText }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate 5 Drafts'
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

export default EmailGenerationConfigModal;

