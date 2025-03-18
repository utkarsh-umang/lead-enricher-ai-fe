import React from 'react';
import { ActivityEvent } from '../../types';
import './ActivityLog.css';

interface ActivityLogProps {
  events: ActivityEvent[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ events }) => {
  const formatTime = (date: Date): string => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="activity-log">
      {events.length > 0 && (
        <div className="activity-item">
          Recent Activity: {events[0].message} {formatTime(events[0].timestamp)}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;