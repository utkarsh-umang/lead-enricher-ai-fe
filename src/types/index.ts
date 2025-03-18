export interface Batch {
  id: string;
  name: string;
  date: string;
  leadsCount: number;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface BatchStats {
  totalLeads: number;
  totalLeadsChange: number;
  completed: number;
  completionRate: number;
  processing: number;
  estimatedCompletion: string;
}

export interface ActivityEvent {
  id: string;
  batchName: string;
  message: string;
  timestamp: Date;
}