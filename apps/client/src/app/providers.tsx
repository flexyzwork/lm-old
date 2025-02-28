'use client';

import React from 'react';
import StoreProvider from '@/state/redux';
import { AuthProvider } from '@/context/AuthProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthProvider>
        <StoreProvider>{children}</StoreProvider>;
      </AuthProvider>
    </>
  );
};

export default Providers;
