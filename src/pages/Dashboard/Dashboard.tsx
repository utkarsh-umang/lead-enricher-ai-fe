import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import BatchTable from '../../components/BatchTable/BatchTable';
import StatCard from '../../components/StatCard/StatCard';
import ActionButton from '../../components/ActionButton/ActionButton';
import ActivityLog from '../../components/ActivityLog/ActivityLog';
import { Batch, BatchStats, ActivityEvent } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - in a real app, this would come from an API
  const [batches] = useState<Batch[]>([
    {
      id: '1',
      name: 'March Campaign',
      date: '2025-03-15',
      leadsCount: 124,
      status: 'Completed',
    },
  ]);

  const [stats] = useState<BatchStats>({
    totalLeads: 1245,
    totalLeadsChange: 12,
    completed: 984,
    completionRate: 79,
    processing: 261,
    estimatedCompletion: '2h 15m',
  });

  const [events] = useState<ActivityEvent[]>([
    {
      id: '1',
      batchName: 'Tech Startups',
      message: 'Batch "Tech Startups" completed processing',
      timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    },
  ]);

  const handleViewBatch = (batchId: string) => {
    console.log(`View batch with id: ${batchId}`);
    // In a real app, you would navigate to a batch detail page
  };

  const handleExportBatch = (batchId: string) => {
    console.log(`Export batch with id: ${batchId}`);
    // In a real app, you would trigger a download
  };

  const handleUploadLeadList = () => {
    // Navigate to the upload view
    navigate('/upload');
  };

  return (
    <div className="dashboard">
      <Header title="Lead Enrichment Dashboard" />

      <div className="dashboard-content">
        <BatchTable 
          batches={batches} 
          onView={handleViewBatch} 
          onExport={handleExportBatch} 
        />

        <div className="stats-container">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            subtitle={`+${stats.totalLeadsChange}% from last month`}
          />
          
          <StatCard
            title="Completed"
            value={stats.completed.toLocaleString()}
            subtitle={`${stats.completionRate}% completion rate`}
          />
          
          <StatCard
            title="Processing"
            value={stats.processing.toLocaleString()}
            subtitle={`Est. completion: ${stats.estimatedCompletion}`}
          />
        </div>

        <div className="upload-container">
          <ActionButton
            label="Upload New Lead List"
            onClick={handleUploadLeadList}
            variant="primary"
            fullWidth
          />
        </div>

        <ActivityLog events={events} />
      </div>
    </div>
  );
};

export default Dashboard;