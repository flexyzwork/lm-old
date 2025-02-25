'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  language: string;
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  return (
    <SyntaxHighlighter language={language} style={oneDark} className="rounded-lg p-4 text-sm">
      {children}
    </SyntaxHighlighter>
  );
}