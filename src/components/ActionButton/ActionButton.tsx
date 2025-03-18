import React from 'react';
import './ActionButton.css';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  fullWidth = false,
}) => {
  return (
    <button
      className={`action-button ${variant} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ActionButton;