'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUsuarios, deleteUsuario } from '@/src/services/usuarios.service';
import type { Usuario } from '@/src/types/usuario';
import { usePermissions } from '@/src/hooks/usePermissions';
import { toast } from 'sonner';

export type FiltroPerfilTipo = 'todos' | 'admin' | 'secretaria' | 'tecnico';

interface UseUsuariosOptions {
  roleFiltroPadrao?: string;
}

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useUsuarios({ roleFiltroPadrao }: UseUsuariosOptions = {}) {
  const { isSecretaria } = usePermissions();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);
  const [busca, setBusca] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState<FiltroPerfilTipo>('todos');

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);

        const dados = await getUsuarios();

        if (ativo) {
          // Regra de segurança/visibilidade: Secretaria só visualiza Técnicos
          let lista = dados;
          if (isSecretaria) {
            lista = lista.filter(
              (u) => normalizar(u.role?.nome) === 'tecnico',
            );
          } else if (roleFiltroPadrao) {
            const alvo = normalizar(roleFiltroPadrao);
            lista = lista.filter(
              (u) => normalizar(u.role?.nome) === alvo,
            );
          }

          setUsuarios(lista);
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
  }, [versao, roleFiltroPadrao, isSecretaria]);

  const excluirUsuario = useCallback(
    async (id: string | number): Promise<boolean> => {
      try {
        await deleteUsuario(id);
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

  const usuariosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return usuarios.filter((u) => {
      // 1. Filtro por perfil/função selecionado
      if (filtroPerfil !== 'todos') {
        const roleNome = normalizar(u.role?.nome);
        if (filtroPerfil === 'admin' && !roleNome.includes('admin')) {
          return false;
        }
        if (filtroPerfil === 'secretaria' && roleNome !== 'secretaria') {
          return false;
        }
        if (filtroPerfil === 'tecnico' && roleNome !== 'tecnico') {
          return false;
        }
      }

      // 2. Filtro textual
      if (!termo) return true;

      return (
        normalizar(u.nome).includes(termo) ||
        normalizar(u.cpf).includes(termo) ||
        normalizar(u.email).includes(termo) ||
        normalizar(u.telefone).includes(termo) ||
        normalizar(u.role?.nome).includes(termo)
      );
    });
  }, [usuarios, busca, filtroPerfil]);

  return {
    usuarios,
    usuariosFiltrados,
    // Aliases para manter compatibilidade
    users: usuarios,
    usersFiltrados: usuariosFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    filtroPerfil,
    setFiltroPerfil,
    recarregar,
    excluirUsuario,
    excluirUser: excluirUsuario,
  };
}
