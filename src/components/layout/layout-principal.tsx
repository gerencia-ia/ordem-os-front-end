'use client';

import type React from 'react';

import { useState } from 'react';
import { BarraNavegacao } from './barra-navegacao';
import { BarraLateral } from './barra-lateral';

interface LayoutPrincipalProps {
  children: React.ReactNode;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

export function LayoutPrincipal({
  children,
}: LayoutPrincipalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <BarraLateral
        estaAberta={sidebarOpen}
        aoFechar={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BarraNavegacao onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
