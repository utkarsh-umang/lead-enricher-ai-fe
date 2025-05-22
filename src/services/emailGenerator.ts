//@ts-nocheck
export interface Placeholder {
  type: 'standard' | 'choice';
  raw: string;
  name?: string;
  options?: string[];
  position: number;
}

export interface TemplateAnalysis {
  placeholders: Placeholder[];
}

export interface SampleData {
  [key: string]: string;
}

/**
 * Utility to generate email previews based on templates
 */
const EmailGenerator = {
  /**
   * Generate a preview email based on a template
   * @param templateText - The email template with placeholders
   * @param sampleData - Optional sample data to use for placeholders
   * @returns The generated preview email
   */
  generatePreview: (templateText: string, sampleData: SampleData | null = null): string => {
    if (!templateText) return '';
    
    // If no sample data is provided, use default sample data
    const data = sampleData || {
      "Name": "Jason",
      "Company": "Real Estate Ventures LLC",
      "Position": "Founder & CEO",
      "Email": "jason@reventures.com",
      "LinkedIn URL": "linkedin.com/in/jasonsmith",
      "Recent Podcast": "Real Estate Today",
      "Podcast Topic": "starting the clock"
    };
    
    // Replace placeholders in the template
    let preview = templateText;
    
    // Replace standard placeholders: [Name of the Person] -> Jason
    preview = preview.replace(/\[Name of the Person\]/g, data.Name || "Jason");
    preview = preview.replace(/\[Personalisation\]/g, `"${data["Podcast Topic"] || "starting the clock"}"`);
    preview = preview.replace(/\[Name of Pod\]/g, data["Recent Podcast"] || "Real Estate Today");
    
    // Replace advanced placeholders with random selection: {options - [A/B/C]} -> B
    const complexPlaceholderRegex = /\{any-one from the following - \[(.*?)\]\}/g;
    preview = preview.replace(complexPlaceholderRegex, (match, optionsStr) => {
      const options = optionsStr.split('/');
      // Choose a random option (for preview purposes)
      return options[Math.floor(Math.random() * options.length)].trim();
    });
    
    return preview;
  },
  
  /**
   * Process a template and convert it to a rich model with placeholders identified
   * This is useful for template editing interfaces
   * @param templateText - The email template
   * @returns Object with identified placeholders
   */
  analyzeTemplate: (templateText: string): TemplateAnalysis => {
    if (!templateText) return { placeholders: [] };
    
    const placeholders: Placeholder[] = [];
    
    // Match standard placeholders: [Something]
    const standardRegex = /\[(.*?)\]/g;
    let match;
    while ((match = standardRegex.exec(templateText)) !== null) {
      placeholders.push({
        type: 'standard',
        raw: match[0],
        name: match[1],
        position: match.index
      });
    }
    
    // Match complex placeholders: {any-one from the following - [A/B/C]}
    const complexRegex = /\{any-one from the following - \[(.*?)\]\}/g;
    while ((match = complexRegex.exec(templateText)) !== null) {
      placeholders.push({
        type: 'choice',
        raw: match[0],
        options: match[1].split('/').map(o => o.trim()),
        position: match.index
      });
    }
    
    return {
      placeholders: placeholders.sort((a, b) => a.position - b.position)
    };
  }
};

export default EmailGenerator;