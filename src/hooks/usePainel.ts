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

  const [filtroAno, setFiltroAno] = useState<number>(() =>
    new Date().getFullYear(),
  );
  const [filtroMes, setFiltroMes] = useState<string>(() =>
    String(new Date().getMonth() + 1),
  );

  const carregarOrdens = useCallback(async () => {
    try {
      setErro(null);
      const mesParam =
        filtroMes === 'todos' ? undefined : parseInt(filtroMes, 10);

      const data = await getOrdens(mesParam, filtroAno);
      setOrdens(data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Erro ao carregar dados do painel.';
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filtroAno, filtroMes]);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        setLoading(true);
        const mesParam =
          filtroMes === 'todos' ? undefined : parseInt(filtroMes, 10);

        const data = await getOrdens(mesParam, filtroAno);
        if (ativo) {
          setOrdens(data);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Erro ao carregar dados do painel.';
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
  }, [filtroAno, filtroMes]);

  const ordensFiltradas = useMemo(() => {
    if (filtroMes !== 'todos') return ordens;
    return ordens.filter((o) => {
      const ref = o.data_agendamento || o.created_at;
      if (!ref) return true;
      const d = new Date(ref);
      if (isNaN(d.getTime())) return true;
      return d.getFullYear() === filtroAno;
    });
  }, [ordens, filtroAno, filtroMes]);

  const podeVerMetricasFinanceiras = perfil
    ? pode.verMetricasFinanceiras(perfil)
    : false;

  // Cálculos de métricas
  const metricas = useMemo(() => {
    const total = ordensFiltradas.length;

    let agendadas = 0;
    let emProgresso = 0;
    let concluidas = 0;
    let canceladas = 0;
    let valorTotal = 0;

    for (const o of ordensFiltradas) {
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
  }, [ordensFiltradas]);

  // Gráfico de Donut por Status (compatível com ChartConfig)
  const dadosStatusPie = useMemo(() => {
    return [
      {
        status: 'agendadas',
        label: 'Agendadas',
        value: metricas.agendadas,
        fill: 'var(--color-agendadas)',
      },
      {
        status: 'em_progresso',
        label: 'Em Progresso',
        value: metricas.emProgresso,
        fill: 'var(--color-em_progresso)',
      },
      {
        status: 'concluidas',
        label: 'Concluídas',
        value: metricas.concluidas,
        fill: 'var(--color-concluidas)',
      },
      {
        status: 'canceladas',
        label: 'Canceladas',
        value: metricas.canceladas,
        fill: 'var(--color-canceladas)',
      },
    ].filter((item) => item.value > 0);
  }, [metricas]);

  // Gráfico de Barras por Prioridade (compatível com ChartConfig)
  const dadosPrioridadeBar = useMemo(() => {
    let critica = 0;
    let alta = 0;
    let media = 0;
    let baixa = 0;

    for (const o of ordensFiltradas) {
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
      {
        nivel: 'critica',
        prioridade: 'Crítica',
        total: critica,
        fill: 'var(--color-critica)',
      },
      {
        nivel: 'alta',
        prioridade: 'Alta',
        total: alta,
        fill: 'var(--color-alta)',
      },
      {
        nivel: 'media',
        prioridade: 'Média',
        total: media,
        fill: 'var(--color-media)',
      },
      {
        nivel: 'baixa',
        prioridade: 'Baixa',
        total: baixa,
        fill: 'var(--color-baixa)',
      },
    ];
  }, [ordensFiltradas]);

  // Gráfico de Área: Evolução no período (mensal no ano inteiro ou diário no mês)
  const dadosEvolucaoPeriodo = useMemo(() => {
    if (filtroMes === 'todos') {
      const nomesMeses = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      const buckets = nomesMeses.map((nome) => ({
        periodo: nome,
        ordens: 0,
        faturamento: 0,
      }));

      for (const o of ordensFiltradas) {
        const ref = o.data_agendamento || o.created_at;
        if (!ref) continue;
        const d = new Date(ref);
        if (isNaN(d.getTime())) continue;
        const idx = d.getMonth();
        if (buckets[idx]) {
          buckets[idx].ordens += 1;
          buckets[idx].faturamento += Number(o.valor_total) || 0;
        }
      }
      return buckets;
    }

    const mesNum = parseInt(filtroMes, 10);
    const totalDias = new Date(filtroAno, mesNum, 0).getDate();
    const buckets = Array.from({ length: totalDias }, (_, i) => ({
      periodo: String(i + 1).padStart(2, '0'),
      ordens: 0,
      faturamento: 0,
    }));

    for (const o of ordensFiltradas) {
      const ref = o.data_agendamento || o.created_at;
      if (!ref) continue;
      const d = new Date(ref);
      if (isNaN(d.getTime())) continue;
      const idx = d.getDate() - 1;
      if (buckets[idx]) {
        buckets[idx].ordens += 1;
        buckets[idx].faturamento += Number(o.valor_total) || 0;
      }
    }
    return buckets;
  }, [ordensFiltradas, filtroAno, filtroMes]);

  return {
    ordens: ordensFiltradas,
    loading,
    erro,
    filtroAno,
    setFiltroAno,
    filtroMes,
    setFiltroMes,
    recarregar: carregarOrdens,
    metricas,
    dadosStatusPie,
    dadosPrioridadeBar,
    dadosEvolucaoPeriodo,
    podeVerMetricasFinanceiras,
  };
}
