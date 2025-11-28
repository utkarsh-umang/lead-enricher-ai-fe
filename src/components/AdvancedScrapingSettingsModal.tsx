import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { useTheme } from '../theme';

interface CustomCategory {
  id: string;
  name: string;
  keywords: string[];
}

interface AdvancedScrapingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScraping: (enabledDefaultCategories: string[], customCategories: CustomCategory[]) => void;
  isLoading?: boolean;
}

const defaultCategories = [
  { id: 'home', name: 'Home Page' },
  { id: 'about', name: 'About Us' },
  { id: 'services', name: 'Services Page' }
];

const AdvancedScrapingSettingsModal = ({
  isOpen,
  onClose,
  onStartScraping,
  isLoading = false
}: AdvancedScrapingSettingsModalProps) => {
  const { theme } = useTheme();
  const [enabledDefaultCategories, setEnabledDefaultCategories] = useState<Set<string>>(
    new Set(defaultCategories.map(cat => cat.id))
  );
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [errors, setErrors] = useState({ categoryName: '', keywords: '' });
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEnabledDefaultCategories(new Set(defaultCategories.map(cat => cat.id)));
      setCustomCategories([]);
      setCategoryName('');
      setKeywords('');
      setErrors({ categoryName: '', keywords: '' });
      setIsAdvancedSettingsOpen(false);
    }
  }, [isOpen]);

  const handleAddCategory = () => {
    // Validate inputs
    const newErrors = { categoryName: '', keywords: '' };
    
    if (!categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    
    if (!keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }

    // Check for duplicate category name
    if (customCategories.some(cat => cat.name.toLowerCase() === categoryName.trim().toLowerCase())) {
      newErrors.categoryName = 'Category name already exists';
    }

    setErrors(newErrors);

    if (!newErrors.categoryName && !newErrors.keywords) {
      // Parse keywords (comma-separated)
      const keywordList = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const newCategory: CustomCategory = {
        id: `custom-${Date.now()}`,
        name: categoryName.trim(),
        keywords: keywordList
      };

      setCustomCategories([...customCategories, newCategory]);
      setCategoryName('');
      setKeywords('');
      setErrors({ categoryName: '', keywords: '' });
    }
  };

  const handleRemoveCategory = (id: string) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== id));
  };

  const handleToggleDefaultCategory = (categoryId: string) => {
    if (isLoading) return;
    setEnabledDefaultCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleStartScraping = () => {
    onStartScraping(Array.from(enabledDefaultCategories), customCategories);
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
          className="rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-2xl relative z-10"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4" style={{ backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium" style={{ color: theme.palette.text.primary }}>Scraping Settings</h3>
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

            {/* Description */}
            <p className="text-sm mb-6" style={{ color: theme.palette.text.secondary }}>
              Configure data categories and keywords to refine web scraping. Toggle default categories on or off.
            </p>

            {/* Default Categories Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3" style={{ color: theme.palette.text.primary }}>Default Categories</h4>
              <div className="flex flex-wrap gap-3">
                {defaultCategories.map((category) => {
                  const isEnabled = enabledDefaultCategories.has(category.id);
                  return (
                    <div 
                      key={category.id}
                      className="flex items-center gap-2 p-3 rounded-md flex-1 min-w-[140px]"
                      style={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <span className="text-sm flex-1" style={{ color: theme.palette.text.primary }}>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleDefaultCategory(category.id)}
                        disabled={isLoading}
                        className="relative inline-block w-10 h-5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1"
                        style={{ 
                          backgroundColor: isEnabled ? theme.palette.primary.main : theme.palette.divider,
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
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
                      >
                        <div 
                          className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"
                          style={{ 
                            backgroundColor: theme.palette.background.default,
                            transform: isEnabled ? 'translateX(20px)' : 'translateX(2px)',
                            left: '2px'
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.palette.background.default;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                  }
                }}
              >
                <h4 className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>Advanced Settings</h4>
                <ChevronDown 
                  className="h-5 w-5 transition-transform duration-200"
                  style={{ 
                    color: theme.palette.text.secondary,
                    transform: isAdvancedSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Accordion Content */}
              {isAdvancedSettingsOpen && (
                <div className="mt-3 p-4 rounded-md" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider, borderWidth: '1px', borderStyle: 'solid' }}>
                  <h4 className="text-sm font-medium mb-3" style={{ color: theme.palette.text.primary }}>Add Custom Categories</h4>
                  
                  {/* Category Name Input */}
                  <div className="mb-4">
                    <label htmlFor="categoryName" className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.primary }}>
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={categoryName}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                        if (errors.categoryName) {
                          setErrors({ ...errors, categoryName: '' });
                        }
                      }}
                      disabled={isLoading}
                      placeholder="e.g., Pricing, Team"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        borderColor: errors.categoryName ? theme.palette.error.main : theme.palette.divider,
                        backgroundColor: isLoading ? theme.palette.background.paper : theme.palette.background.default,
                        color: theme.palette.text.primary
                      }}
                      onFocus={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.borderColor = theme.palette.primary.main;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                        }
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.categoryName ? theme.palette.error.main : theme.palette.divider;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    {errors.categoryName && (
                      <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>{errors.categoryName}</p>
                    )}
                  </div>

                  {/* Keywords Input */}
                  <div className="mb-4">
                    <label htmlFor="keywords" className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.primary }}>
                      Keywords (Comma-separated for sub-URL filtering)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="keywords"
                        value={keywords}
                        onChange={(e) => {
                          setKeywords(e.target.value);
                          if (errors.keywords) {
                            setErrors({ ...errors, keywords: '' });
                          }
                        }}
                        disabled={isLoading}
                        placeholder="e.g., /pricing, /plans, /cost, /our-team"
                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-50"
                        style={{
                          borderColor: errors.keywords ? theme.palette.error.main : theme.palette.divider,
                          backgroundColor: isLoading ? theme.palette.background.paper : theme.palette.background.default,
                          color: theme.palette.text.primary
                        }}
                        onFocus={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.borderColor = theme.palette.primary.main;
                            e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.palette.primary.light}40`;
                          }
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = errors.keywords ? theme.palette.error.main : theme.palette.divider;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddCategory}
                        disabled={isLoading || !categoryName.trim() || !keywords.trim()}
                        className="px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={
                          isLoading || !categoryName.trim() || !keywords.trim()
                            ? {
                                backgroundColor: theme.palette.divider,
                                color: theme.palette.text.disabled
                              }
                            : {
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.default
                              }
                        }
                        onMouseEnter={(e) => {
                          if (!isLoading && categoryName.trim() && keywords.trim()) {
                            e.currentTarget.style.opacity = '0.9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLoading && categoryName.trim() && keywords.trim()) {
                            e.currentTarget.style.opacity = '1';
                          }
                        }}
                      >
                        Add Category
                      </button>
                    </div>
                    {errors.keywords && (
                      <p className="mt-1 text-xs" style={{ color: theme.palette.error.main }}>{errors.keywords}</p>
                    )}
                  </div>

                  {/* Custom Categories List */}
                  {customCategories.length > 0 && (
                    <div className="space-y-2">
                      {customCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 rounded-md"
                          style={{
                            backgroundColor: theme.palette.background.default,
                            borderColor: theme.palette.divider,
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>{category.name}: </span>
                            <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                              {category.keywords.join(', ')}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveCategory(category.id)}
                            disabled={isLoading}
                            className="ml-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ 
                              color: isLoading ? theme.palette.text.disabled : theme.palette.error.main
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.opacity = '0.8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.opacity = '1';
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: theme.palette.background.paper }}>
            <button
              type="button"
              onClick={handleStartScraping}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                isLoading
                  ? {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      cursor: 'not-allowed'
                    }
                  : {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }
              }
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
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" style={{ color: theme.palette.primary.contrastText }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                'Start Scraping'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal at document body level to ensure it's above everything including sidebar
  return createPortal(modalContent, document.body);
};

export default AdvancedScrapingSettingsModal;

