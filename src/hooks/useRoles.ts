'use client';

import { useEffect, useState } from 'react';
import { getRoles } from '@/src/services/roles.service';
import type { Role } from '@/src/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);
        const data = await getRoles();
        if (ativo) {
          setRoles(data);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar funções';
          setErro(msg);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregar();

    return () => {
      ativo = false;
    };
  }, []);

  return { roles, loading, erro };
}
