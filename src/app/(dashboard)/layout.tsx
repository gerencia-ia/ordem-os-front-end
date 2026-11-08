'use client';

import type React from 'react';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BarraNavegacao } from '@/src/components/Layout/BarraNavegacao';
import { BarraLateral } from '@/src/components/Layout/BarraLateral';
import { estaAutenticado } from '@/src/services/auth.service';
import { usePermissions } from '@/src/hooks/usePermissions';
import { toast } from 'sonner';

const subscribe = () => () => {};

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
  const [autenticado, setAutenticado] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { podeAcessar, perfil } = usePermissions();

  useEffect(() => {
    // Só verificar autenticação no cliente após montar
    if (!montado) return;

    // Pequeno delay para garantir que localStorage está atualizado
    const timer = setTimeout(() => {
      const isAuth = estaAutenticado();

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

      setAutenticado(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [montado, pathname, router, podeAcessar, perfil]);

  // Não mostrar nada até verificar autenticação
  if (!montado || !autenticado) {
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
