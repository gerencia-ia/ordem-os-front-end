'use client';

import { ThemeProvider } from 'next-themes';
import type React from 'react';

interface ProvedorTemaProps {
  children: React.ReactNode;
}

export function ProveedorTema({ children }: ProvedorTemaProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
