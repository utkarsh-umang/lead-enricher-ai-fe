import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="header-button">Batches</button>
        <button className="header-button">Settings</button>
      </div>
    </header>
  );
};

export default Header;