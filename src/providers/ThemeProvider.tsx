'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type React from 'react';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

// Aliases em português para retrocompatibilidade
export const ProvedorTema = ThemeProvider;
export const ProveedorTema = ThemeProvider;
