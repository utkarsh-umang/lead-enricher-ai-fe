export type BatchStatusType = 'success' | 'warning' | 'info' | 'processing';
export type ActionType = 'primary' | 'secondary';

export interface Batch {
  id: number;
  listName: string;
  source: string;
  numberOfLeads: number;
  sourceType: 'apollo' | 'linkedin' | 'upload' | 'unknown';
  dateImported: string;
  status: string;
  statusType: BatchStatusType;
  progress: number;
  action: string | null;
  actionType: ActionType | null;
}

export const batches: Batch[] = [
  {
    id: 1,
    listName: 'SaaS Founders Q4',
    source: 'Apollo',
    numberOfLeads: 4000,
    sourceType: 'apollo',
    dateImported: 'Oct 26',
    status: 'Scraping...',
    statusType: 'warning',
    progress: 60,
    action: 'View Details',
    actionType: 'secondary'
  },
  {
    id: 2,
    listName: 'Local Agencies',
    numberOfLeads: 3000,
    source: 'LinkedIn',
    sourceType: 'linkedin',
    dateImported: 'Oct 25',
    status: 'Generating Emails...',
    statusType: 'info',
    progress: 25,
    action: 'View Drafts',
    actionType: 'secondary'
  },
  {
    id: 3,
    listName: 'E-commerce Leads Nov',
    numberOfLeads: 2000,
    source: 'Upload',
    sourceType: 'upload',
    dateImported: 'Oct 24',
    status: 'Completed',
    statusType: 'success',
    progress: 100,
    action: 'Export CSV',
    actionType: 'primary'
  },
  {
    id: 4,
    listName: 'Raw Marketing List',
    source: 'Unknown',
    numberOfLeads: 3450,
    sourceType: 'unknown',
    dateImported: 'Today, 10:15 AM',
    status: 'Processing Upload',
    statusType: 'processing',
    progress: 0,
    action: null,
    actionType: null
  }
];



