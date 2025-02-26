import React from 'react';

interface HeadingProps {
  title: string;
  subtitle?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
};
