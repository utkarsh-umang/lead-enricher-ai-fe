import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface SheetData {
  id: string;
  title: string;
  enrichmentColumns: string[];
}

const CampaignDetailsPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Get campaign data from localStorage (set when navigating from campaigns list)
    const storedData = localStorage.getItem('campaignData');
    if (storedData) {
      loadCampaignData(JSON.parse(storedData).spreadsheetId);
    } else {
      alert("No spreadsheet found");
    }
  }, []);

  // Update preview text whenever template text changes
  useEffect(() => {
    if (templateText) {
      setPreviewText(EmailGenerator.generatePreview(templateText));
    }
  }, [templateText]);

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
    } catch (err) {
      console.error("Error loading campaign data:", err);
      setError("Failed to load campaign data. Please try again later.");
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
        const storedData = localStorage.getItem('campaignData');
        if (storedData) {
          await loadCampaignData(JSON.parse(storedData).spreadsheetId);
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
        
        // Reload the page data
        const storedData = localStorage.getItem('campaignData');
        if (storedData) {
          await loadCampaignData(JSON.parse(storedData).spreadsheetId);
        }
      }
    } catch (err) {
      console.error("Error finalizing campaign:", err);
      setError("Failed to finalize campaign. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        {/* Back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/outreach-campaigns')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Campaigns
          </button>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="ml-3 text-sm text-green-700">
                {campaignData?.status === "running" 
                  ? "Campaign has been finalized and is now running." 
                  : "Template has been saved successfully."}
              </p>
            </div>
          </div>
        )}
        
        {/* Campaign content */}
        {!isLoading && !error && campaignData && templateData && sheetData && (
          <>
            {/* Campaign status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Campaign : {isLoading ? "Loading campaign details..." : (campaignData ? campaignData.campaign_name : "Campaign Name")}
                </h1>
                
                {campaignData.status === "draft" ? (
                  <div className="flex"> 
                    <h2 className="text-lg font-medium text-gray-900">Campaign Status -  </h2>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                      Draft
                    </span>
                  </div>
                ) : (
                  <div className="flex">
                    <h2 className="text-lg font-medium text-gray-900">Campaign Status -  </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm flex items-center">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Running
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-gray-700 font-medium">Sheet Information</span>
                </div>
                <div className="ml-7">
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Sheet:</span> {sheetData.title}
                  </p>
                  <div className="mt-3">
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Enrichment data that will be sent in outreach generation Prompt:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sheetData.enrichmentColumns.map((column, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
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
                
                <h2 className="text-lg font-medium text-gray-900">Template Name  - {isLoading ? "Loading campaign details..." : (templateData ? templateData.name : "Campaign Details")}</h2>
                
                {campaignData.status === "draft" && (
                  <button
                    onClick={handleSaveTemplate}
                    disabled={isSaving}
                    className={`flex items-center px-3 py-1.5 ${
                      isSaving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white rounded-md text-sm transition-colors`}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Saving..." : "Save Template"}
                  </button>
                )}
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Text {campaignData.status !== "draft" && "(View Only)"}
                </label>
                <textarea
                  value={templateText}
                  onChange={handleTemplateChange}
                  disabled={campaignData.status !== "draft"}
                  className={`w-full h-64 p-3 border ${
                    campaignData.status === "draft" 
                      ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      : "bg-gray-50 border-gray-200"
                  } rounded-md font-mono text-sm`}
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Preview
                  </label>
                  <span className="text-xs text-gray-500">
                    How your email might look when sent
                  </span>
                </div>
                <div className="w-full h-64 p-3 bg-gray-50 border border-gray-200 rounded-md overflow-auto whitespace-pre-wrap text-sm">
                  {previewText}
                </div>
              </div>
              
              {campaignData.status === "draft" && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleOpenFinalizeModal}
                    disabled={isSaving}
                    className={`flex items-center px-4 py-2 ${
                      isSaving ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                    } text-white rounded-md text-sm transition-colors`}
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Finalize Template & Start Campaign
                  </button>
                </div>
              )}
            </div>
            
            {/* Campaign metrics (only shown for running campaigns) */}
            {campaignData.status === "running" && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Metrics (we can use instantly numbers directly here via integration)</h2>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-700">0</div>
                    <div className="text-sm text-indigo-600">Emails Sent</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">0</div>
                    <div className="text-sm text-blue-600">Opens</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">0</div>
                    <div className="text-sm text-green-600">Replies</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-700">0</div>
                    <div className="text-sm text-red-600">Bounces</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    <strong>Note:</strong> Campaign metrics will update as emails are sent and responses are received.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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