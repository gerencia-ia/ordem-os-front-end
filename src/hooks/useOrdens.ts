'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getOrdens, deleteOrdem } from '@/src/services/ordens.service';
import type { OrdemServico } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { toast } from 'sonner';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [filtroTecnico, setFiltroTecnico] = useState('todos');
  const [filtroData, setFiltroData] = useState('');

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);

        const dados = await getOrdens();
        if (ativo) {
          setOrdens(dados);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Erro ao carregar ordens de serviço';
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

  const excluirOrdem = useCallback(
    async (id: string | number): Promise<boolean> => {
      try {
        await deleteOrdem(id);
        toast.success('Ordem de serviço excluída com sucesso!');
        recarregar();
        return true;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Erro ao excluir ordem de serviço';
        toast.error(msg);
        return false;
      }
    },
    [recarregar],
  );

  const ordensFiltradas = useMemo(() => {
    const termo = normalizar(busca);

    return ordens.filter((ordem) => {
      // 1. Busca textual ampla
      if (termo) {
        const matchCliente = normalizar(ordem.cliente?.nome).includes(termo);
        const matchNumero = normalizar(ordem.numero_ordem).includes(termo);
        const matchDescricao = normalizar(ordem.descricao).includes(termo);
        const matchObservacao = normalizar(ordem.observacao).includes(termo);
        const tecnicosLista: Usuario[] = Array.isArray(ordem.tecnicos)
          ? ordem.tecnicos
          : ordem.tecnicos && typeof ordem.tecnicos === 'object' && 'id' in ordem.tecnicos
            ? [ordem.tecnicos as Usuario]
            : [];

        const matchTecnico =
          normalizar(ordem.tecnico_responsavel?.nome).includes(termo) ||
          tecnicosLista.some((t) => normalizar(t.nome).includes(termo));

        if (
          !matchCliente &&
          !matchNumero &&
          !matchDescricao &&
          !matchObservacao &&
          !matchTecnico
        ) {
          return false;
        }
      }

      // 2. Filtro por status
      if (filtroStatus !== 'todos') {
        const statusNome = normalizar(ordem.status?.nome);
        const statusId = String(ordem.status?.id || ordem.status_id || '');
        if (
          statusNome !== normalizar(filtroStatus) &&
          statusId !== filtroStatus
        ) {
          return false;
        }
      }

      // 3. Filtro por prioridade
      if (filtroPrioridade !== 'todos') {
        const prioridadeDescricao = normalizar(
          ordem.prioridade?.descricao || ordem.prioridade_descricao,
        );
        const prioridadeId = String(
          ordem.prioridade?.id || ordem.prioridade_id || '',
        );
        if (
          prioridadeDescricao !== normalizar(filtroPrioridade) &&
          prioridadeId !== filtroPrioridade
        ) {
          return false;
        }
      }

      // 4. Filtro por técnico
      if (filtroTecnico !== 'todos') {
        const tecnicosLista: Usuario[] = Array.isArray(ordem.tecnicos)
          ? ordem.tecnicos
          : ordem.tecnicos && typeof ordem.tecnicos === 'object' && 'id' in ordem.tecnicos
            ? [ordem.tecnicos as Usuario]
            : [];

        const matchesTecnicoId =
          String(ordem.tecnico_responsavel?.id || '') === filtroTecnico ||
          tecnicosLista.some((t) => String(t.id) === filtroTecnico);
        if (!matchesTecnicoId) {
          return false;
        }
      }

      // 5. Filtro por data
      if (filtroData) {
        const dataOrdem = ordem.data_agendamento?.split('T')[0] ?? '';
        if (dataOrdem !== filtroData) {
          return false;
        }
      }

      return true;
    });
  }, [
    ordens,
    busca,
    filtroStatus,
    filtroPrioridade,
    filtroTecnico,
    filtroData,
  ]);

  const limparFiltros = useCallback(() => {
    setBusca('');
    setFiltroStatus('todos');
    setFiltroPrioridade('todos');
    setFiltroTecnico('todos');
    setFiltroData('');
  }, []);

  return {
    ordens,
    ordensFiltradas,
    loading,
    erro,
    filtros: {
      busca,
      status: filtroStatus,
      prioridade: filtroPrioridade,
      tecnico: filtroTecnico,
      data: filtroData,
    },
    setBusca,
    setFiltroStatus,
    setFiltroPrioridade,
    setFiltroTecnico,
    setFiltroData,
    limparFiltros,
    recarregar,
    excluirOrdem,
  };
}
