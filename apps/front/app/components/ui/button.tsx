'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className = '' }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
