//@ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  MessageSquare,
  PlayCircle
} from 'lucide-react';
import { getAllSheets } from '../services/sheetService';
import * as CampaignService from '../services/campaignService';
import EmailGenerator from '../services/emailGenerator';
import FinalizeModal from '../components/FinalizeCampaignModal';
import CampaignMetricsCards from '../components/CampaignMetricsCards';
import CampaignLeadsTable from '../components/CampaignLeadsTable';
import { useTheme } from '../theme';

interface SheetData {
  id: string;
  title: string;
  enrichmentColumns: string[];
}

interface StoredCampaignData {
  campaignName?: string;
  spreadsheetId?: string;
  source?: string;
  numberOfLeads?: number;
  status?: string;
  statusType?: string;
  progress?: number;
  isNewImport?: boolean;
  sheetTitle?: string;
  sheetUrl?: string;
  sheetName?: string;
  enrichmentColumns?: string[];
}

// Generate 97 unique leads
const generateUniqueLeads = () => {
  const baseLeads = [
    {
      id: '1',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      businessWebsite: 'https://www.acmecorp.com',
      scrapeStatus: 'Success' as const,
      emailStatus: 'Drafted' as const
    },
    {
      id: '2',
      name: 'Jane Smith',
      company: 'Beta Industries',
      email: 'jane@beta.com',
      businessWebsite: 'https://www.betaindustries.com',
      scrapeStatus: 'Pending' as const,
      emailStatus: null
    },
    {
      id: '3',
      name: 'Bob Johnson',
      company: 'Gamma Tech',
      email: 'bob@gamma.com',
      businessWebsite: 'https://www.gammatech.com',
      scrapeStatus: 'Failed' as const,
      emailStatus: null
    }
  ];

  // Generate additional leads to reach 97
  const companies = [
    'Tech Solutions', 'Digital Innovations', 'Cloud Services', 'Data Analytics', 'Software Corp',
    'Web Design Inc', 'Mobile Apps LLC', 'AI Systems', 'Cyber Security', 'Network Solutions',
    'Database Systems', 'Cloud Computing', 'IT Services', 'DevOps Co', 'Platform Technologies',
    'Enterprise Software', 'System Integration', 'Data Management', 'Business Intelligence', 'Automation Systems',
    'Infrastructure Solutions', 'Application Services', 'Digital Transformation', 'Technology Partners', 'Innovation Labs',
    'Smart Solutions', 'Future Tech', 'Next Gen Systems', 'Advanced Computing', 'Digital Agency',
    'Tech Partners', 'Software Solutions', 'IT Consulting', 'Systems Integration', 'Cloud Platforms',
    'Data Science Co', 'Machine Learning Inc', 'Blockchain Solutions', 'IoT Technologies', 'Robotics Corp',
    'Virtual Reality Co', 'Augmented Reality Inc', 'Quantum Computing', 'Edge Computing', 'Serverless Solutions',
    'Microservices Inc', 'API Solutions', 'Integration Services', 'Digital Services', 'Tech Innovation',
    'Software Development', 'Product Engineering', 'Solution Architecture', 'Technical Consulting', 'IT Strategy',
    'Digital Solutions', 'Technology Services', 'IT Infrastructure', 'Business Systems', 'Enterprise Solutions',
    'Technology Consulting', 'Software Engineering', 'Development Services', 'Technical Services', 'IT Solutions',
    'Digital Platforms', 'Technology Platforms', 'Software Platforms', 'Business Platforms', 'Enterprise Platforms',
    'Tech Services', 'IT Services Group', 'Technology Group', 'Software Group', 'Digital Group',
    'Innovation Solutions', 'Creative Tech', 'Design Systems', 'UX Solutions', 'Product Solutions',
    'Development Co', 'Engineering Co', 'Solutions Co', 'Services Co', 'Technology Co',
    'Digital Co', 'Software Co', 'IT Co', 'Tech Co', 'Systems Co'
  ];

  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina',
    'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zach', 'Amy', 'Ben', 'Cara', 'Dan',
    'Ella', 'Finn', 'Gina', 'Hank', 'Iris', 'Jake', 'Kim', 'Leo', 'Maya', 'Nick',
    'Owen', 'Pam', 'Quincy', 'Rose', 'Sean', 'Tara', 'Uma', 'Vince', 'Will', 'Zoe'
  ];

  const lastNames = [
    'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Jackson', 'Johnson',
    'King', 'Lee', 'Martin', 'Miller', 'Moore', 'Nelson', 'Parker', 'Roberts', 'Smith', 'Taylor',
    'Thomas', 'Walker', 'White', 'Wilson', 'Wright', 'Young', 'Adams', 'Baker', 'Carter', 'Cooper',
    'Edwards', 'Green', 'Hall', 'Hill', 'Hughes', 'Jones', 'Lewis', 'Mitchell', 'Murphy', 'Patterson',
    'Price', 'Reed', 'Richardson', 'Robinson', 'Scott', 'Stewart', 'Turner', 'Ward', 'Watson', 'Wood'
  ];

  const statuses: Array<'Success' | 'Pending' | 'Failed'> = ['Success', 'Pending', 'Failed'];
  const emailStatuses: Array<'Drafted' | null> = ['Drafted', null];

  const leads = [...baseLeads];
  
  // Generate remaining leads to reach 97
  for (let i = 4; i <= 97; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const companySlug = company.toLowerCase().replace(/\s+/g, '');
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companySlug}.com`;
    
    leads.push({
      id: String(i),
      name: `${firstName} ${lastName}`,
      company: company,
      email: email,
      businessWebsite: `https://www.${companySlug}.com`,
      scrapeStatus: statuses[Math.floor(Math.random() * statuses.length)],
      emailStatus: emailStatuses[Math.floor(Math.random() * emailStatuses.length)]
    });
  }

  return leads;
};

// Generate 97 unique leads
const uniqueLeads = generateUniqueLeads();

// Repeat the 97 leads 100 times (9700 total leads)
const mockLeads = Array(100).fill(null).flatMap((_, repeatIndex) => 
  uniqueLeads.map((lead, leadIndex) => ({
    ...lead,
    id: `lead-${repeatIndex * 97 + leadIndex + 1}` // Ensure unique IDs across repeats
  }))
);

const CampaignDetailsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [campaignData, setCampaignData] = useState<CampaignService.Campaign | null>(null);
  const [templateData, setTemplateData] = useState<CampaignService.Template | null>(null);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'template'>('overview');
  const [storedData, setStoredData] = useState<StoredCampaignData | null>(null);
  const [isEmailGenerationConfigured, setIsEmailGenerationConfigured] = useState(false);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadCampaign = async () => {
      // Priority 1: If campaignId is in URL, fetch by campaign ID
      if (campaignId && !campaignId.startsWith('batch-') && !campaignId.startsWith('import-')) {
        try {
          await loadCampaignById(campaignId);
          return;
        } catch (err) {
          console.error("Error loading campaign by ID, falling back to localStorage:", err);
          // Fall through to localStorage approach
        }
      }

      // Priority 2: Get campaign data from localStorage (for backward compatibility)
      const stored = localStorage.getItem('campaignData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as StoredCampaignData;
          setStoredData(parsed);
          
          // If campaignId is in URL and matches stored data, or if no campaignId but we have stored data
          if (campaignId && parsed.spreadsheetId && campaignId !== parsed.spreadsheetId) {
            // URL campaignId doesn't match stored data, try to load by URL campaignId
            try {
              await loadCampaignById(campaignId);
              return;
            } catch (err) {
              console.error("Error loading campaign by URL ID:", err);
            }
          }
          
          // Determine view mode based on data
          // If it's from dashboard/import (has campaignName but no sheet_id), show overview
          // If it's from outreach campaigns (has spreadsheetId that's a real sheet), show template editor
          if (parsed.isNewImport || parsed.campaignName || parsed.spreadsheetId?.startsWith('batch-') || parsed.spreadsheetId?.startsWith('import-')) {
            setViewMode('overview');
            setIsLoading(false);
          } else if (parsed.spreadsheetId) {
            // Try to load from API using sheet ID
            await loadCampaignData(parsed.spreadsheetId);
          } else {
            setError("No campaign data found");
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Error parsing campaign data:", err);
          setError("Invalid campaign data");
          setIsLoading(false);
        }
      } else if (campaignId) {
        // We have a campaignId in URL but no localStorage data, try to load by ID
        try {
          await loadCampaignById(campaignId);
        } catch (err) {
          setError("Campaign not found");
          setIsLoading(false);
        }
      } else {
        setError("No campaign data found");
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  // Update preview text whenever template text changes
  useEffect(() => {
    if (templateText) {
      setPreviewText(EmailGenerator.generatePreview(templateText));
    }
  }, [templateText]);

  const loadCampaignById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch campaign by ID
      const campaignResponse = await CampaignService.fetchCampaignById(id);
      setCampaignData(campaignResponse.campaign);
      
      // Get template for the campaign
      const templateResponse = await CampaignService.getTemplatesByPrompt(campaignResponse.campaign.prompt_id);
      
      // Find the specific template for this campaign
      const template = templateResponse.templates.find(
        t => t._id === campaignResponse.campaign.template_id
      );
      
      if (template) {
        setTemplateData(template);
        setTemplateText(template.template_text);
        setPreviewText(template.example_template_output);
      }
      
      // Get sheet details to populate sheet data
      const sheetsResponse = await getAllSheets();
      const sheetInfo = sheetsResponse.find(sheet => sheet.spreadsheetId === campaignResponse.campaign.sheet_id);
      
      if (sheetInfo) {
        setSheetData({
          id: campaignResponse.campaign.sheet_id,
          title: sheetInfo.title,
          enrichmentColumns: sheetInfo.enrichmentColumns || []
        });
      }
      
      // If campaign status is draft, show template editor, otherwise show overview
      if (campaignResponse.campaign.status === 'draft') {
        setViewMode('template');
      } else {
        setViewMode('overview');
      }
    } catch (err) {
      console.error("Error loading campaign by ID:", err);
      setError("Failed to load campaign data. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadCampaignData = async (sheetId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get sheet details first to get the agency ID
      const sheetsResponse = await getAllSheets();
      const sheetInfo = sheetsResponse.find(sheet => sheet.spreadsheetId === sheetId);
      
      if (!sheetInfo) {
        throw new Error("Sheet not found");
      }
      
      // Use the agency ID from local storage or a default one
      const agencyId = localStorage.getItem('userAgencyId') || "";
      
      // Fetch or create campaign for this sheet
      const campaignResponse = await CampaignService.fetchOrCreateCampaign(sheetId, agencyId);
      setCampaignData(campaignResponse.campaign);
      
      // Get template for the campaign
      const templateResponse = await CampaignService.getTemplatesByPrompt(campaignResponse.campaign.prompt_id);
      
      // Find the specific template for this campaign
      const template = templateResponse.templates.find(
        t => t._id === campaignResponse.campaign.template_id
      );
      
      if (template) {
        setTemplateData(template);
        setTemplateText(template.template_text);
        setPreviewText(template.example_template_output);
      }
      
      // Set sheet data
      setSheetData({
        id: sheetId,
        title: sheetInfo.title,
        enrichmentColumns: sheetInfo.enrichmentColumns || []
      });
      
      // If campaign status is draft, show template editor, otherwise show overview
      if (campaignResponse.campaign.status === 'draft') {
        setViewMode('template');
      } else {
        setViewMode('overview');
      }
    } catch (err) {
      console.error("Error loading campaign data:", err);
      // If API fails but we have stored data, show overview with stored data
      if (storedData) {
        setViewMode('overview');
      } else {
        setError("Failed to load campaign data. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateText(e.target.value);
    // Preview will update via useEffect
  };

  const handleSaveTemplate = async () => {
    if (!templateData || !campaignData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Update the campaign's template
      const result = await CampaignService.updateCampaignTemplate(
        campaignData._id, 
        templateText,
        previewText
      );
      
      if (result.success) {
        // After successful update, refresh the campaign data to get the new template ID
        const stored = localStorage.getItem('campaignData');
        if (stored) {
          const parsed = JSON.parse(stored) as StoredCampaignData;
          if (parsed.spreadsheetId && !parsed.spreadsheetId.startsWith('batch-') && !parsed.spreadsheetId.startsWith('import-')) {
            await loadCampaignData(parsed.spreadsheetId);
          }
        }
        
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error saving template:", err);
      setError("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFinalizeModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseFinalizeModal = () => {
    if (!isSaving) {
      setIsModalOpen(false);
    }
  };

  const handleFinalizeCampaign = async (campaignName: string, templateName: string) => {
    if (!campaignData) return;
    
    setIsSaving(true);
    
    try {
      // Call the finalize API
      const result = await CampaignService.finalizeCampaign(
        campaignData._id,
        campaignName,
        templateName,
        templateText,
        previewText
      );
      
      if (result.success) {
        // Update local state
        setCampaignData({
          ...campaignData,
          status: result.status,
          campaign_name: result.campaign_name
        });
        
        // Close modal
        setIsModalOpen(false);
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        
        // Switch to overview mode
        setViewMode('overview');
        
        // Reload the page data
        const stored = localStorage.getItem('campaignData');
        if (stored) {
          const parsed = JSON.parse(stored) as StoredCampaignData;
          if (parsed.spreadsheetId && !parsed.spreadsheetId.startsWith('batch-') && !parsed.spreadsheetId.startsWith('import-')) {
            await loadCampaignData(parsed.spreadsheetId);
          }
        }
      }
    } catch (err) {
      console.error("Error finalizing campaign:", err);
      setError("Failed to finalize campaign. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Get campaign name from stored data or campaign data
  const getCampaignName = () => {
    if (storedData?.campaignName) return storedData.campaignName;
    if (campaignData?.campaign_name) return campaignData.campaign_name;
    return 'Campaign';
  };

  // Get campaign status
  const getCampaignStatus = () => {
    if (storedData?.status) return storedData.status;
    if (campaignData?.status === 'draft') return 'Draft';
    if (campaignData?.status === 'running') return 'Running';
    return 'Scraping in Progress';
  };

  // Get metrics from stored data or calculate from leads
  const getMetrics = () => {
    const totalLeads = storedData?.numberOfLeads || 97;
    const scrapingProgress = storedData?.progress || 0;
    const isScrapingConfigured = scrapingProgress > 0;

    return {
      totalLeads,
      scrapingProgress,
      isScrapingConfigured,
      isEmailGenerationConfigured,
      estimatedTimeLeft
    };
  };

  // Handle configure scraping button click
  const handleConfigureScraping = () => {
    // TODO: Implement scraping configuration logic
    console.log('Configure and Start Scraping clicked');
    // This should open a modal or navigate to scraping configuration page
    // For now, we'll just log it
  };

  // Handle configure email generation button click
  const handleConfigureEmailGeneration = () => {
    // TODO: Implement email generation configuration logic
    console.log('Configure and Start Email Generation clicked');
    // This should open a modal or navigate to email generation configuration page
    // For now, we'll just log it
    setIsEmailGenerationConfigured(true);
  };

  // Calculate estimated time when both scraping and email generation are configured
  useEffect(() => {
    const scrapingProgress = storedData?.progress || 0;
    const isScrapingConfigured = scrapingProgress > 0;
    
    if (isScrapingConfigured && isEmailGenerationConfigured) {
      // TODO: Replace with actual time calculation based on remaining work
      // Example calculation based on total leads and progress
      const totalLeads = storedData?.numberOfLeads || 97;
      const remainingLeads = totalLeads * (1 - scrapingProgress / 100);
      // Rough estimate: 1 minute per lead for scraping + email generation
      const estimatedMinutes = Math.ceil(remainingLeads * 1);
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      
      if (hours > 0) {
        setEstimatedTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setEstimatedTimeLeft(`${minutes}m`);
      }
    }
  }, [storedData?.progress, storedData?.numberOfLeads, isEmailGenerationConfigured]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center mr-4 transition-colors"
          style={{ color: theme.palette.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.palette.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.palette.text.secondary;
          }}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: theme.palette.primary.main }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div 
          className="rounded-md p-4 mb-6"
          style={{
            backgroundColor: `${theme.palette.error.main}15`,
            borderColor: theme.palette.error.main,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex">
            <AlertCircle 
              className="h-5 w-5" 
              style={{ color: theme.palette.error.main }}
            />
            <p 
              className="ml-3 text-sm"
              style={{ color: theme.palette.error.main }}
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Success message */}
      {saveSuccess && (
        <div 
          className="rounded-md p-4 mb-6"
          style={{
            backgroundColor: `${theme.palette.success.main}15`,
            borderColor: theme.palette.success.main,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex">
            <CheckCircle2 
              className="h-5 w-5" 
              style={{ color: theme.palette.success.main }}
            />
            <p 
              className="ml-3 text-sm"
              style={{ color: theme.palette.success.main }}
            >
              {campaignData?.status === "running" 
                ? "Campaign has been finalized and is now running." 
                : "Template has been saved successfully."}
            </p>
          </div>
        </div>
      )}

      {/* Campaign Overview View */}
      {!isLoading && !error && viewMode === 'overview' && (
        <>
          {/* Campaign Title and Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 
                className="text-2xl font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Campaign: {getCampaignName()}
              </h1>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: theme.palette.warning.main,
                  color: theme.palette.text.primary
                }}
              >
                {getCampaignStatus()}
              </span>
            </div>
          </div>

          {/* Metrics Cards */}
          <CampaignMetricsCards 
            {...getMetrics()}
            onConfigureScraping={handleConfigureScraping}
            onConfigureEmailGeneration={handleConfigureEmailGeneration}
          />

          {/* Campaign Leads Table */}
          <CampaignLeadsTable 
            leads={mockLeads}
            isScrapingStarted={getMetrics().isScrapingConfigured}
            isEmailGenerationStarted={isEmailGenerationConfigured}
            onViewEdit={(leadId) => {
              console.log('View/Edit lead:', leadId);
              // TODO: Implement view/edit functionality
            }}
            onRetry={(leadId) => {
              console.log('Retry lead:', leadId);
              // TODO: Implement retry functionality
            }}
            onViewScrapingInfo={(leadId) => {
              console.log('View scraping info for lead:', leadId);
              // TODO: Implement view scraping info functionality
            }}
            onViewGeneratedEmail={(leadId) => {
              console.log('View generated email for lead:', leadId);
              // TODO: Implement view generated email functionality
            }}
          />
        </>
      )}

      {/* Template Editor View */}
      {!isLoading && !error && viewMode === 'template' && campaignData && templateData && sheetData && (
        <>
          {/* Campaign status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 
                className="text-2xl font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Campaign : {campaignData.campaign_name}
              </h1>
              
              {campaignData.status === "draft" ? (
                <div className="flex"> 
                  <h2 
                    className="text-lg font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Campaign Status -  
                  </h2>
                  <span 
                    className="px-3 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: theme.palette.warning.main,
                      color: theme.palette.text.primary
                    }}
                  >
                    Draft
                  </span>
                </div>
              ) : (
                <div className="flex">
                  <h2 
                    className="text-lg font-medium"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Campaign Status -  
                  </h2>
                  <span 
                    className="px-3 py-1 rounded-md text-sm flex items-center"
                    style={{
                      backgroundColor: theme.palette.success.main,
                      color: theme.palette.text.primary
                    }}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Running
                  </span>
                </div>
              )}
            </div>
            
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              <div className="flex items-center mb-2">
                <MessageSquare 
                  className="h-5 w-5 mr-2" 
                  style={{ color: theme.palette.info.main }}
                />
                <span 
                  className="font-medium"
                  style={{ color: theme.palette.text.primary }}
                >
                  Sheet Information
                </span>
              </div>
              <div className="ml-7">
                <p 
                  className="mb-1"
                  style={{ color: theme.palette.text.secondary }}
                >
                  <span className="font-medium">Sheet:</span> {sheetData.title}
                </p>
                <div className="mt-3">
                  <p 
                    className="mb-2"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    <span className="font-medium">Enrichment data that will be sent in outreach generation Prompt:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sheetData.enrichmentColumns.map((column, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: theme.palette.info.main,
                          color: theme.palette.text.primary
                        }}
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Template editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 
                className="text-lg font-medium"
                style={{ color: theme.palette.text.primary }}
              >
                Template Name  - {templateData.name}
              </h2>
              
              {campaignData.status === "draft" && (
                <button
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={
                    isSaving
                      ? {
                          backgroundColor: theme.palette.text.disabled,
                          color: theme.palette.text.primary
                        }
                      : {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? "Saving..." : "Save Template"}
                </button>
              )}
            </div>
            
            <div className="mb-2">
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: theme.palette.text.secondary }}
              >
                Template Text {campaignData.status !== "draft" && "(View Only)"}
              </label>
              <textarea
                value={templateText}
                onChange={handleTemplateChange}
                disabled={campaignData.status !== "draft"}
                className="w-full h-64 p-3 rounded-md font-mono text-sm"
                style={
                  campaignData.status === "draft"
                    ? {
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary
                      }
                    : {
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.disabled
                      }
                }
                onFocus={(e) => {
                  if (campaignData.status === "draft") {
                    e.currentTarget.style.borderColor = theme.palette.primary.main;
                    e.currentTarget.style.outline = `2px solid ${theme.palette.primary.main}40`;
                  }
                }}
                onBlur={(e) => {
                  if (campaignData.status === "draft") {
                    e.currentTarget.style.borderColor = theme.palette.divider;
                    e.currentTarget.style.outline = 'none';
                  }
                }}
              />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label 
                  className="block text-sm font-medium"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Preview
                </label>
                <span 
                  className="text-xs"
                  style={{ color: theme.palette.text.disabled }}
                >
                  How your email might look when sent
                </span>
              </div>
              <div 
                className="w-full h-64 p-3 rounded-md overflow-auto whitespace-pre-wrap text-sm"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: theme.palette.text.primary
                }}
              >
                {previewText}
              </div>
            </div>
            
            {campaignData.status === "draft" && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleOpenFinalizeModal}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 rounded-md text-sm transition-colors"
                  style={
                    isSaving
                      ? {
                          backgroundColor: theme.palette.text.disabled,
                          color: theme.palette.text.primary
                        }
                      : {
                          backgroundColor: theme.palette.success.main,
                          color: theme.palette.text.primary
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Finalize Template & Start Campaign
                </button>
              </div>
            )}
          </div>
          
          {/* Campaign metrics (only shown for running campaigns) */}
          {campaignData.status === "running" && (
            <div 
              className="mt-8 pt-6"
              style={{
                borderTopColor: theme.palette.divider,
                borderTopWidth: '1px',
                borderTopStyle: 'solid'
              }}
            >
              <h2 
                className="text-lg font-medium mb-4"
                style={{ color: theme.palette.text.primary }}
              >
                Campaign Metrics (we can use instantly numbers directly here via integration)
              </h2>
              
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: theme.palette.primary.light }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: theme.palette.text.primary }}
                  >
                    0
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Emails Sent
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: `${theme.palette.info.main}20` }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: theme.palette.info.main }}
                  >
                    0
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Opens
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: `${theme.palette.success.main}20` }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: theme.palette.success.main }}
                  >
                    0
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Replies
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: `${theme.palette.error.main}20` }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: theme.palette.error.main }}
                  >
                    0
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Bounces
                  </div>
                </div>
              </div>
              
              <div 
                className="mt-6 p-4 rounded-lg"
                style={{ backgroundColor: theme.palette.primary.light }}
              >
                <p 
                  className="text-sm"
                  style={{ color: theme.palette.text.primary }}
                >
                  <strong>Note:</strong> Campaign metrics will update as emails are sent and responses are received.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Finalize Modal */}
      <FinalizeModal
        isOpen={isModalOpen}
        onClose={handleCloseFinalizeModal}
        onFinalize={handleFinalizeCampaign}
        isLoading={isSaving}
        defaultTemplateName={templateData?.name || ''}
      />
    </div>
  );
};

export default CampaignDetailsPage;
