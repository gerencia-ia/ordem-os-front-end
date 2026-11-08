'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { OrdemServico } from '@/src/types/ordem';
import { getOrdens } from '@/src/services/ordens.service';
import { usePermissions } from '@/src/hooks/usePermissions';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function usePainel() {
  const { perfil, pode } = usePermissions();

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  });

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
        err instanceof Error ? err.message : 'Erro ao carregar dados do painel.';
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

        const data = await getOrdens(mes, ano);
        if (ativo) {
          setOrdens(data);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar dados do painel.';
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

  const podeVerMetricasFinanceiras = perfil
    ? pode.verMetricasFinanceiras(perfil)
    : false;

  // Cálculos de métricas
  const metricas = useMemo(() => {
    const total = ordens.length;

    let agendadas = 0;
    let emProgresso = 0;
    let concluidas = 0;
    let canceladas = 0;
    let valorTotal = 0;

    for (const o of ordens) {
      const sId = Number(o.status?.id || o.status_id || 0);
      const sNome = normalizar(o.status?.nome || o.status_descricao);

      if (sId === 1 || sNome.includes('agendad') || sNome.includes('abert')) {
        agendadas++;
      } else if (
        sId === 2 ||
        sId === 6 ||
        sNome.includes('progresso') ||
        sNome.includes('andamento')
      ) {
        emProgresso++;
      } else if (sId === 3 || sNome.includes('conclui')) {
        concluidas++;
      } else if (sId === 4 || sNome.includes('cancelad')) {
        canceladas++;
      }

      const val = Number(o.valor_total) || 0;
      valorTotal += val;
    }

    const taxaConclusao =
      total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return {
      total,
      agendadas,
      emProgresso,
      concluidas,
      canceladas,
      valorTotal,
      taxaConclusao,
    };
  }, [ordens]);

  // Gráfico de Pizza por Status
  const dadosStatusPie = useMemo(() => {
    return [
      { name: 'Agendadas', value: metricas.agendadas, color: '#F59E0B' },
      { name: 'Em Progresso', value: metricas.emProgresso, color: '#3B82F6' },
      { name: 'Concluídas', value: metricas.concluidas, color: '#10B981' },
      { name: 'Canceladas', value: metricas.canceladas, color: '#EF4444' },
    ].filter((item) => item.value > 0);
  }, [metricas]);

  // Gráfico de Barras por Prioridade
  const dadosPrioridadeBar = useMemo(() => {
    let critica = 0;
    let alta = 0;
    let media = 0;
    let baixa = 0;

    for (const o of ordens) {
      const pNome = normalizar(
        o.prioridade?.descricao || o.prioridade_descricao,
      );

      if (pNome.includes('critica')) {
        critica++;
      } else if (pNome.includes('alta')) {
        alta++;
      } else if (pNome.includes('media')) {
        media++;
      } else if (pNome.includes('baixa')) {
        baixa++;
      }
    }

    return [
      { prioridade: 'Crítica', total: critica, fill: '#DC2626' },
      { prioridade: 'Alta', total: alta, fill: '#F97316' },
      { prioridade: 'Média', total: media, fill: '#F59E0B' },
      { prioridade: 'Baixa', total: baixa, fill: '#3B82F6' },
    ];
  }, [ordens]);

  return {
    ordens,
    loading,
    erro,
    filtroMes,
    setFiltroMes,
    recarregar: carregarOrdens,
    metricas,
    dadosStatusPie,
    dadosPrioridadeBar,
    podeVerMetricasFinanceiras,
  };
}
