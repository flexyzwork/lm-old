'use client';

import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  className?: string;
}

export function Input({ type = 'text', placeholder, className = '' }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}