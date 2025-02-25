'use client';

import React from 'react';

interface TimelineItemProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

export function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function TimelineItem({ title, date, children }: TimelineItemProps) {
  return (
    <div className="relative pl-6 border-l-4 border-blue-500">
      <div className="absolute -left-[10px] top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <span className="text-sm text-gray-500">{date}</span>
      <p className="mt-1 text-gray-600">{children}</p>
    </div>
  );
}