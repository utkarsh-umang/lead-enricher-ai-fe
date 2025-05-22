import { API_BASE_URL } from '../config/env';

// Types for campaign data
export interface Campaign {
  _id: string;
  campaign_name: string;
  sheet_id: string;
  agency_id: string;
  prompt_id: string;
  template_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignResponse {
  campaign: Campaign;
}

export interface Template {
  _id: string;
  name: string;
  template_text: string;
  example_template_output: string;
  prompt_id: string;
  agency_id: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplatesResponse {
  templates: Template[];
}

export interface Prompt {
  _id: string;
  name: string;
  use_case: string;
  description?: string;
  instructions: string;
  tags?: string[];
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptsResponse {
  prompts: Prompt[];
}

export interface TemplateUpdateResponse {
  success: boolean;
  new_template_id: string;
}

/**
 * Fetch or create a campaign for a sheet
 * @param sheetId - The Google Sheet ID
 * @param agencyId - The agency ID
 * @returns Promise with campaign data
 */
export const fetchOrCreateCampaign = async (
  sheetId: string,
  agencyId: string
): Promise<CampaignResponse> => {
  if (!sheetId) {
    throw new Error('Sheet ID is required');
  }
  
  if (!agencyId) {
    throw new Error('Agency ID is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/campaign/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sheet_id: sheetId,
        agency_id: agencyId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or creating campaign:', error);
    throw error;
  }
};

/**
 * Update the template text for a campaign
 * @param campaignId - The campaign ID
 * @param newTemplateText - The updated template text
 * @returns Promise with success status and new template ID
 */
export const updateCampaignTemplate = async (
  campaignId: string,
  newTemplateText: string,
  newTemplateOutput: string
): Promise<TemplateUpdateResponse> => {
  if (!campaignId) {
    throw new Error('Campaign ID is required');
  }
  
  if (!newTemplateText) {
    throw new Error('Template text is required');
  }

  if (!newTemplateOutput) {
    throw new Error('Template output is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/campaign/update-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        new_template_text: newTemplateText,
        new_template_output: newTemplateOutput
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating campaign template:', error);
    throw error;
  }
};

/**
 * Get all email prompts
 * @returns Promise with all prompts
 */
export const getAllPrompts = async (): Promise<PromptsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/prompt/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

/**
 * Get templates for a specific prompt
 * @param promptId - The prompt ID
 * @returns Promise with templates for the prompt
 */
export const getTemplatesByPrompt = async (
  promptId: string
): Promise<TemplatesResponse> => {
  if (!promptId) {
    throw new Error('Prompt ID is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/template/by-prompt/${promptId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching templates for prompt:', error);
    throw error;
  }
};

/**
 * Create a new prompt
 * @param promptData - The prompt data
 * @returns Promise with the created prompt ID
 */
export const createPrompt = async (
  promptData: {
    name: string;
    use_case: string;
    description?: string;
    instructions: string;
    tags?: string[];
  }
): Promise<{ _id: string }> => {
  if (!promptData.name || !promptData.use_case || !promptData.instructions) {
    throw new Error('Name, use case, and instructions are required for creating a prompt');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(promptData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }
};

/**
 * Create a new template
 * @param templateData - The template data
 * @returns Promise with the created template ID
 */
export const createTemplate = async (
  templateData: {
    name: string;
    template_text: string;
    example_template_output: string;
    prompt_id: string;
    agency_id?: string;
    is_default?: boolean;
  }
): Promise<{ _id: string }> => {
  if (!templateData.name || !templateData.template_text || !templateData.prompt_id) {
    throw new Error('Name, template text, and prompt ID are required for creating a template');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(templateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

/**
 * Finalize campaign and start outreach
 * @param campaignId - The campaign ID
 * @param campaignName - The name for the campaign
 * @param templateName - The name for the template
 * @param templateText - The final template text
 * @returns Promise with success status and details
 */
export const finalizeCampaign = async (
  campaignId: string,
  campaignName: string,
  templateName: string,
  templateText: string,
  templateOutput: string
): Promise<{
  success: boolean;
  new_template_id: string;
  status: string;
  campaign_name: string;
}> => {
  if (!campaignId) {
    throw new Error('Campaign ID is required');
  }
  
  if (!campaignName) {
    throw new Error('Campaign name is required');
  }
  
  if (!templateName) {
    throw new Error('Template name is required');
  }
  
  if (!templateText) {
    throw new Error('Template text is required');
  }

  if (!templateOutput) {
    throw new Error('Template output is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/outreach/campaign/finalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        campaign_name: campaignName,
        new_template_name: templateName,
        new_template_text: templateText,
        new_template_output: templateOutput
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error finalizing campaign:', error);
    throw error;
  }
};
