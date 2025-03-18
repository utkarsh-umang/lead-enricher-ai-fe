import React from 'react';
import { Batch } from '../../types';
import ActionButton from '../ActionButton/ActionButton';
import './BatchTable.css';

interface BatchTableProps {
  batches: Batch[];
  onView: (batchId: string) => void;
  onExport: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, onView, onExport }) => {
  return (
    <div className="batch-table-container">
      <h2 className="section-title">Recent Batches</h2>
      <table className="batch-table">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Date</th>
            <th>Leads</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>{batch.name}</td>
              <td>{batch.date}</td>
              <td>{batch.leadsCount}</td>
              <td>
                <span className={`status-badge ${batch.status.toLowerCase()}`}>
                  {batch.status}
                </span>
              </td>
              <td className="action-cell">
                <ActionButton 
                  label="View" 
                  onClick={() => onView(batch.id)} 
                  variant="primary"
                />
                <ActionButton 
                  label="Export" 
                  onClick={() => onExport(batch.id)} 
                  variant="secondary"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchTable;