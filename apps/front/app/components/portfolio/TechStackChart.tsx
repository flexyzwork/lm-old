'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const techStackData = [
  { name: 'Node.js', value: 40 },
  { name: 'Express', value: 30 },
  { name: 'PostgreSQL', value: 20 },
  { name: 'Next.js', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function TechStackChart() {
  return (
    <div className="flex justify-center">
      <PieChart width={300} height={300}>
        <Pie data={techStackData} cx={150} cy={150} outerRadius={100} fill="#8884d8" dataKey="value">
          {techStackData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
