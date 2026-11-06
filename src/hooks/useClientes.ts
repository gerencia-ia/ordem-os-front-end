'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getClientes, deleteCliente } from '@/src/services/clientes.service';
import type { Cliente } from '@/src/types/cliente';
import { toast } from 'sonner';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroMarcador, setFiltroMarcador] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);
        const dados = await getClientes();
        if (ativo) {
          setClientes(dados);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar clientes';
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
  }, [versao]);

  const excluirCliente = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteCliente(id);
        toast.success('Cliente removido com sucesso!');
        recarregar();
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Erro ao excluir cliente';
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

  const clientesFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return clientes.filter((c) => {
      const matchBusca =
        !termo ||
        normalizar(c.nome).includes(termo) ||
        normalizar(c.email).includes(termo) ||
        c.telefones?.some((t) => normalizar(t.numero).includes(termo)) ||
        c.enderecos?.some(
          (e) =>
            normalizar(e.rua).includes(termo) ||
            normalizar(e.bairro).includes(termo) ||
            normalizar(e.cidade).includes(termo),
        );

      let matchMarcador = true;
      if (filtroMarcador === 'sem_visita') {
        matchMarcador = !c.data_ultima_visita;
      } else if (filtroMarcador === 'com_visita') {
        matchMarcador = Boolean(c.data_ultima_visita);
      }

      return matchBusca && matchMarcador;
    });
  }, [clientes, busca, filtroMarcador]);

  return {
    clientes,
    clientesFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    filtroMarcador,
    setFiltroMarcador,
    recarregar,
    excluirCliente,
  };
}
