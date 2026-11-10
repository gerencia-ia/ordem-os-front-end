'use client';

import type React from 'react';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BarraNavegacao } from '@/src/components/Layout/BarraNavegacao';
import { BarraLateral } from '@/src/components/Layout/BarraLateral';
import { estaAutenticado } from '@/src/services/auth.service';
import { usePermissions } from '@/src/hooks/usePermissions';
import { toast } from 'sonner';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('auth:logout', callback);
  window.addEventListener('auth:login', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth:logout', callback);
    window.removeEventListener('auth:login', callback);
  };
};

export default function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  const [barraLateralAberta, setBarraLateralAberta] = useState(false);
  const montado = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isAuth = useSyncExternalStore(subscribe, estaAutenticado, () => false);
  const router = useRouter();
  const pathname = usePathname();
  const { podeAcessar, perfil } = usePermissions();

  useEffect(() => {
    if (!montado) return;

    if (!isAuth) {
      router.push('/login');
      return;
    }

    // Verificação de permissão de rota
    if (pathname && perfil && !podeAcessar(pathname)) {
      toast.error('Você não possui permissão para acessar esta área.');
      router.push('/ordens');
      return;
    }
  }, [montado, isAuth, pathname, router, podeAcessar, perfil]);

  // Não mostrar nada até verificar autenticação
  if (!montado || !isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <BarraLateral
        estaAberta={barraLateralAberta}
        aoFechar={() => setBarraLateralAberta(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BarraNavegacao
          onMenuToggle={() => setBarraLateralAberta(!barraLateralAberta)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
