'use client';

import type React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/src/components/Ui/sonner';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

export * from './ThemeProvider';
