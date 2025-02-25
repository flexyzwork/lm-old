'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CardSection({ title, children }: CardSectionProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="mt-2 text-gray-600">{children}</div>
      </CardContent>
    </Card>
  );
}