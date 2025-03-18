import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBatchesClick = () => {
    navigate('/dashboard');
  };

  const handleSettingsClick = () => {
    // In a real app, you would navigate to a settings page
    console.log('Settings clicked');
  };

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="header-button" onClick={handleBatchesClick}>Batches</button>
        <button className="header-button" onClick={handleSettingsClick}>Settings</button>
      </div>
    </header>
  );
};

export default Header;