'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-white shadow-lg rounded-lg border border-gray-200 ${className}`}>{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}