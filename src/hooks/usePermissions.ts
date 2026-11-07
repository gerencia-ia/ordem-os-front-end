'use client';

import { useSyncExternalStore } from 'react';
import { getUsuario } from '@/src/lib/api/autenticacao';
import {
  normalizarPerfil,
  podeAcessarRota,
  CAPACIDADES,
  type Perfil,
} from '@/src/lib/permissions';

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

const getServerSnapshot = () => null;

export function usePermissions() {
  const usuario = useSyncExternalStore(
    subscribe,
    getUsuario,
    getServerSnapshot,
  );

  const perfil: Perfil | null = normalizarPerfil(usuario?.role);

  const filtrarRolesPermitidas = <T extends { nome: string }>(
    roles: T[],
  ): T[] => {
    if (!perfil) return [];
    if (perfil === 'admin') return roles;
    if (perfil === 'secretaria') {
      return roles.filter((r) => normalizarPerfil(r.nome) === 'tecnico');
    }
    return [];
  };

  const podeAlterarFuncaoDeUsuario = (alvoUserId?: string | number): boolean => {
    if (!alvoUserId || !usuario) return false;
    // O usuário logado não pode alterar o próprio perfil
    if (String(alvoUserId) === String(usuario.user_id)) {
      return false;
    }
    // Apenas Administrador pode alterar papéis de forma ampla
    // Secretaria pode alterar apenas de técnicos
    return perfil === 'admin' || perfil === 'secretaria';
  };

  return {
    usuario,
    perfil,
    isAdmin: perfil === 'admin',
    isSecretaria: perfil === 'secretaria',
    isTecnico: perfil === 'tecnico',
    podeAcessar: (rota: string) => podeAcessarRota(rota, perfil),
    pode: CAPACIDADES,
    filtrarRolesPermitidas,
    podeAlterarFuncaoDeUsuario,
  };
}
