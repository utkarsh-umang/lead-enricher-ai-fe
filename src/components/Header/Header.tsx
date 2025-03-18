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

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="header-button" onClick={handleBatchesClick}>Batches</button>
      </div>
    </header>
  );
};

export default Header;