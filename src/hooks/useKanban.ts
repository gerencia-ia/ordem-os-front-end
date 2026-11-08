'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { OrdemServico, Status } from '@/src/types/ordem';
import { getOrdens, updateOrdemStatus } from '@/src/services/ordens.service';
import { getStatus } from '@/src/services/status.service';

const STATUS_COLUNAS_PADRAO: Status[] = [
  { id: 1, nome: 'Agendado' },
  { id: 2, nome: 'Em Progresso' },
  { id: 3, nome: 'Concluído' },
  { id: 4, nome: 'Cancelado' },
];

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useKanban() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [colunasStatus, setColunasStatus] = useState<Status[]>(STATUS_COLUNAS_PADRAO);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros
  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  });
  const [busca, setBusca] = useState('');

  // Drag and Drop
  const [draggedOrdemId, setDraggedOrdemId] = useState<number | null>(null);
  const [colunaAtivaDrop, setColunaAtivaDrop] = useState<number | null>(null);

  // Modal de Criação de OS
  const [modalCriarAberta, setModalCriarAberta] = useState(false);
  const [statusPredefinido, setStatusPredefinido] = useState<number | undefined>(undefined);

  // Carrega status da API
  const carregarStatus = useCallback(async () => {
    try {
      const lista = await getStatus();
      if (lista && lista.length > 0) {
        // Filtra os 4 status operacionais principais para as colunas do kanban
        const operacionais = lista.filter((s) => {
          const nomeNorm = normalizar(s.nome);
          return (
            nomeNorm.includes('agendad') ||
            nomeNorm.includes('progresso') ||
            nomeNorm.includes('andamento') ||
            nomeNorm.includes('conclui') ||
            nomeNorm.includes('cancelad')
          );
        });

        if (operacionais.length > 0) {
          setColunasStatus(operacionais);
        }
      }
    } catch {
      // Mantém fallback padrão
    }
  }, []);

  // Carrega ordens do período
  const carregarOrdens = useCallback(async () => {
    try {
      setErro(null);
      const [anoStr, mesStr] = filtroMes.split('-');
      const ano = parseInt(anoStr, 10);
      const mes = parseInt(mesStr, 10);

      const data = await getOrdens(mes, ano);
      setOrdens(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao carregar ordens do quadro.';
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filtroMes]);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        setLoading(true);
        const [anoStr, mesStr] = filtroMes.split('-');
        const ano = parseInt(anoStr, 10);
        const mes = parseInt(mesStr, 10);

        const [ordensData, statusData] = await Promise.allSettled([
          getOrdens(mes, ano),
          getStatus(),
        ]);

        if (!ativo) return;

        if (ordensData.status === 'fulfilled') {
          setOrdens(ordensData.value);
        } else {
          const msg =
            ordensData.reason instanceof Error
              ? ordensData.reason.message
              : 'Erro ao carregar ordens.';
          setErro(msg);
          toast.error(msg);
        }

        if (statusData.status === 'fulfilled' && statusData.value?.length > 0) {
          const operacionais = statusData.value.filter((s) => {
            const nomeNorm = normalizar(s.nome);
            return (
              nomeNorm.includes('agendad') ||
              nomeNorm.includes('progresso') ||
              nomeNorm.includes('andamento') ||
              nomeNorm.includes('conclui') ||
              nomeNorm.includes('cancelad')
            );
          });
          if (operacionais.length > 0) {
            setColunasStatus(operacionais);
          }
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao inicializar quadro.';
          setErro(msg);
          toast.error(msg);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void inicializar();

    return () => {
      ativo = false;
    };
  }, [filtroMes]);

  // Filtro por texto
  const ordensFiltradas = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return ordens;

    return ordens.filter((o) => {
      const matchNumero = String(o.id).includes(termo) || normalizar(o.numero_ordem).includes(termo);
      const matchCliente = normalizar(o.cliente?.nome).includes(termo);
      const matchDesc = normalizar(o.descricao).includes(termo);
      return matchNumero || matchCliente || matchDesc;
    });
  }, [ordens, busca]);

  // Transição otimista de status via drag-and-drop
  const moverOrdem = async (ordemId: number, novoStatusId: number) => {
    const ordemAnterior = ordens.find((o) => o.id === ordemId);
    if (!ordemAnterior) return;

    const statusDestino = colunasStatus.find((c) => Number(c.id) === novoStatusId);
    const statusAntigoId = Number(ordemAnterior.status?.id || ordemAnterior.status_id || 1);

    if (statusAntigoId === novoStatusId) return;

    // Mutação otimista no estado local
    setOrdens((atuais) =>
      atuais.map((o) => {
        if (o.id !== ordemId) return o;
        return {
          ...o,
          status_id: novoStatusId,
          status: statusDestino || o.status,
          status_descricao: statusDestino?.nome || o.status_descricao,
        };
      }),
    );

    try {
      await updateOrdemStatus(ordemId, novoStatusId);
      toast.success(
        `OS #${ordemId} movida para "${statusDestino?.nome || 'novo status'}"!`,
      );
    } catch (err) {
      // Rollback para o estado anterior em caso de falha
      setOrdens((atuais) =>
        atuais.map((o) => (o.id === ordemId ? ordemAnterior : o)),
      );
      const msg =
        err instanceof Error ? err.message : 'Erro ao atualizar status da ordem.';
      toast.error(msg);
    } finally {
      setDraggedOrdemId(null);
      setColunaAtivaDrop(null);
    }
  };

  const abrirModalCriarComStatus = (statusId?: number) => {
    setStatusPredefinido(statusId);
    setModalCriarAberta(true);
  };

  const fecharModalCriar = () => {
    setModalCriarAberta(false);
    setStatusPredefinido(undefined);
  };

  return {
    ordens: ordensFiltradas,
    colunasStatus,
    loading,
    erro,
    filtroMes,
    setFiltroMes,
    busca,
    setBusca,
    recarregar: carregarOrdens,
    carregarStatus,
    // Drag and Drop
    draggedOrdemId,
    setDraggedOrdemId,
    colunaAtivaDrop,
    setColunaAtivaDrop,
    moverOrdem,
    // Modal
    modalCriarAberta,
    statusPredefinido,
    abrirModalCriarComStatus,
    fecharModalCriar,
  };
}
