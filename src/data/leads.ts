export type LeadStatus = 'Email Ready' | 'Scraped' | 'Pending Scraping';
export type EnrichedDataType = 'Website' | 'LinkedIn' | 'Twitter';

export interface EnrichedData {
  type: EnrichedDataType;
}

export interface Lead {
  id: number;
  leadName: string;
  company: string;
  emailAddress: string;
  sourceList: string;
  status: LeadStatus;
  enrichedData: EnrichedData[];
  hasGeneratedCopy: boolean;
  createdAt: Date; // For sorting by most recent
}

export const leads: Lead[] = [
  {
    id: 1,
    leadName: 'Sarah Jones',
    company: 'TechFlow Inc.',
    emailAddress: 'sarah@techflow.com',
    sourceList: 'SaaS Founders Q4',
    status: 'Email Ready',
    enrichedData: [{ type: 'Website' }, { type: 'LinkedIn' }],
    hasGeneratedCopy: true,
    createdAt: new Date('2024-10-28T10:30:00')
  },
  {
    id: 2,
    leadName: 'David Lee',
    company: 'River Valley Agency',
    emailAddress: 'david@rivervalley.com',
    sourceList: 'Local Agencies',
    status: 'Scraped',
    enrichedData: [{ type: 'Website' }],
    hasGeneratedCopy: false,
    createdAt: new Date('2024-10-28T09:15:00')
  },
  {
    id: 3,
    leadName: 'Mike Brown',
    company: 'Shopify Store 1',
    emailAddress: 'mike@shop1.com',
    sourceList: 'E-commerce Leads Nov',
    status: 'Pending Scraping',
    enrichedData: [],
    hasGeneratedCopy: false,
    createdAt: new Date('2024-10-27T14:20:00')
  },
  {
    id: 4,
    leadName: 'Emily Chen',
    company: 'Innovatech',
    emailAddress: 'emily@innovatech.io',
    sourceList: 'SaaS Founders Q4',
    status: 'Email Ready',
    enrichedData: [{ type: 'Website' }, { type: 'LinkedIn' }, { type: 'Twitter' }],
    hasGeneratedCopy: true,
    createdAt: new Date('2024-10-27T11:45:00')
  },
  {
    id: 5,
    leadName: 'David Lee',
    company: 'River Valley Agency',
    emailAddress: 'david@rivervalley.com',
    sourceList: 'E-commerce Leads Nov',
    status: 'Email Ready',
    enrichedData: [{ type: 'Website' }, { type: 'LinkedIn' }, { type: 'Twitter' }],
    hasGeneratedCopy: true,
    createdAt: new Date('2024-10-26T16:30:00')
  },
  {
    id: 6,
    leadName: 'Alex Thompson',
    company: 'CloudScale Solutions',
    emailAddress: 'alex@cloudscale.io',
    sourceList: 'SaaS Founders Q4',
    status: 'Email Ready',
    enrichedData: [{ type: 'Website' }, { type: 'LinkedIn' }],
    hasGeneratedCopy: true,
    createdAt: new Date('2024-10-26T08:00:00')
  },
  {
    id: 7,
    leadName: 'Jessica Martinez',
    company: 'DataViz Pro',
    emailAddress: 'jessica@datavizpro.com',
    sourceList: 'Local Agencies',
    status: 'Scraped',
    enrichedData: [{ type: 'Website' }],
    hasGeneratedCopy: false,
    createdAt: new Date('2024-10-25T15:20:00')
  },
  {
    id: 8,
    leadName: 'Robert Kim',
    company: 'NextGen Apps',
    emailAddress: 'robert@nextgenapps.com',
    sourceList: 'E-commerce Leads Nov',
    status: 'Pending Scraping',
    enrichedData: [],
    hasGeneratedCopy: false,
    createdAt: new Date('2024-10-25T10:10:00')
  }
];

// Helper function to get leads sorted by most recent
export const getLeadsSortedByRecent = (): Lead[] => {
  return [...leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

