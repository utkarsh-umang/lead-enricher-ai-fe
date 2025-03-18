import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './BatchDetails.css';

interface Lead {
  id: string;
  name: string;
  company: string;
  linkedin: 'View' | 'Processing...' | 'Not Found';
  emailCopy: 'Copy Ready' | 'Processing...' | 'Failed';
  website: 'View' | 'Processing...' | 'Not Found';
  ebook: 'View' | 'Processing...' | 'Not Found';
  blog: 'View' | 'Processing...' | 'Not Found';
}

interface BatchDetail {
  id: string;
  name: string;
  created: string;
  totalLeads: number;
  completedLeads: number;
  processingLeads: number;
  completionPercentage: number;
}

const BatchDetails: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [batch, setBatch] = useState<BatchDetail | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  // In a real app, fetch data from API
  useEffect(() => {
    // Mock data - this would come from an API in a real app
    const mockBatch: BatchDetail = {
      id: batchId || '1',
      name: 'March Campaign',
      created: '2025-03-15',
      totalLeads: 124,
      completedLeads: 98,
      processingLeads: 26,
      completionPercentage: 79,
    };
    
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'TechCorp',
        linkedin: 'View',
        emailCopy: 'Copy Ready',
        website: 'View',
        ebook: 'View',
        blog: 'View',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Data Insights',
        linkedin: 'View',
        emailCopy: 'Copy Ready',
        website: 'View',
        ebook: 'Not Found',
        blog: 'View',
      },
      {
        id: '3',
        name: 'Michael Lee',
        company: 'Cloud Solutions',
        linkedin: 'View',
        emailCopy: 'Processing...',
        website: 'View',
        ebook: 'Processing...',
        blog: 'Processing...',
      },
    ];
    
    setBatch(mockBatch);
    setLeads(mockLeads);
  }, [batchId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch data for this page
  };

  const handleActionClick = (leadId: string, action: string) => {
    console.log(`Action ${action} clicked for lead ${leadId}`);
    // In a real app, you would show a modal or navigate to a detail page
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'View':
        return 'status-view';
      case 'Copy Ready':
        return 'status-ready';
      case 'Processing...':
        return 'status-processing';
      case 'Not Found':
        return 'status-not-found';
      case 'Failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const handleExportClick = (format: 'CSV' | 'Excel') => {
    console.log(`Exporting batch as ${format}`);
    // In a real app, you would trigger a download
  };

  if (!batch) {
    return <div className="loading">Loading batch details...</div>;
  }

  return (
    <div className="batch-details">
      <Header title="Batch Details" />
      
      <div className="batch-details-content">
        <div className="batch-header">
          <div className="batch-info">
            <h2 className="batch-title">Batch: {batch.name}</h2>
            <p className="batch-meta">
              Created: {batch.created} • {batch.totalLeads} leads • {batch.completedLeads} completed • {batch.processingLeads} processing
            </p>
          </div>
          
          <div className="batch-actions">
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${batch.completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{batch.completionPercentage}%</span>
            
            <button 
              className="export-button csv"
              onClick={() => handleExportClick('CSV')}
            >
              CSV
            </button>
            <button 
              className="export-button excel"
              onClick={() => handleExportClick('Excel')}
            >
              Excel
            </button>
          </div>
        </div>
        
        <div className="leads-table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>LinkedIn</th>
                <th>Email Copy</th>
                <th>Website</th>
                <th>eBook</th>
                <th>Blog</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <button 
                      className={`action-button ${getStatusClass(lead.linkedin)}`}
                      onClick={() => handleActionClick(lead.id, 'linkedin')}
                    >
                      {lead.linkedin}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`action-button ${getStatusClass(lead.emailCopy)}`}
                      onClick={() => handleActionClick(lead.id, 'emailCopy')}
                    >
                      {lead.emailCopy}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`action-button ${getStatusClass(lead.website)}`}
                      onClick={() => handleActionClick(lead.id, 'website')}
                    >
                      {lead.website}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`action-button ${getStatusClass(lead.ebook)}`}
                      onClick={() => handleActionClick(lead.id, 'ebook')}
                    >
                      {lead.ebook}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`action-button ${getStatusClass(lead.blog)}`}
                      onClick={() => handleActionClick(lead.id, 'blog')}
                    >
                      {lead.blog}
                    </button>
                  </td>
                  <td>
                    <button className="more-button">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          {[1, 2, 3, 4, 5].map((page) => (
            <button 
              key={page}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;