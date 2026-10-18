import React from 'react';

export default function Badge({ children, variant = 'indigo', className = '', icon: Icon }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
