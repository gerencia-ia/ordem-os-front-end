'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUsers, deleteUser } from '@/src/services/users.service';
import type { User } from '@/src/types/user';
import { toast } from 'sonner';

interface UseUsersOptions {
  roleFiltroPadrao?: string;
}

export function useUsers({ roleFiltroPadrao }: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);
  const [busca, setBusca] = useState('');

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);

        const dados = await getUsers();

        if (ativo) {
          if (roleFiltroPadrao) {
            const normalizado = roleFiltroPadrao.toLowerCase();
            const filtrados = dados.filter(
              (u) => u.role?.nome?.toLowerCase() === normalizado,
            );
            setUsers(filtrados);
          } else {
            setUsers(dados);
          }
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar usuários';
          setErro(msg);
          toast.error(msg);
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
  }, [versao, roleFiltroPadrao]);

  const excluirUser = useCallback(
    async (id: string | number): Promise<boolean> => {
      try {
        await deleteUser(id);
        toast.success('Usuário removido com sucesso!');
        recarregar();
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Erro ao excluir usuário';
        toast.error(msg);
        return false;
      }
    },
    [recarregar],
  );

  const normalizar = (val?: string | null) =>
    (val ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const usersFiltrados = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return users;

    return users.filter((u) => {
      return (
        normalizar(u.nome).includes(termo) ||
        normalizar(u.cpf).includes(termo) ||
        normalizar(u.email).includes(termo) ||
        normalizar(u.telefone).includes(termo) ||
        normalizar(u.role?.nome).includes(termo)
      );
    });
  }, [users, busca]);

  return {
    users,
    usersFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    recarregar,
    excluirUser,
  };
}
