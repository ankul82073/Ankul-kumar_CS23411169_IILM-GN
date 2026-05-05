import React from 'react';
import { clsx } from 'clsx';

const GlassCard = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={clsx('glass-card', className)}>
    {children}
  </div>
);

export default GlassCard;
