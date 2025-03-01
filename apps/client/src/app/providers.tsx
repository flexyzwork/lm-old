'use client';

import React, { useState } from 'react';
import StoreProvider from '@/states/redux';
import { AuthProvider } from '@/context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          {children}
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;