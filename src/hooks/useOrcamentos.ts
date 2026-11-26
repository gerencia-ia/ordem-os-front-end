'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteOrcamento,
  getOrcamentos,
} from '@/src/services/orcamentos.service';
import type { Orcamento } from '@/src/types/orcamento';
import { toast } from 'sonner';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroAno, setFiltroAno] = useState('todos');

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);

        const dados = await getOrcamentos({
          mes: filtroMes !== 'todos' ? Number(filtroMes) : undefined,
          ano: filtroAno !== 'todos' ? Number(filtroAno) : undefined,
        });

        if (ativo) {
          setOrcamentos(dados);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar orçamentos';
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
  }, [versao, filtroMes, filtroAno]);

  const excluirOrcamento = useCallback(
    async (id: string | number): Promise<boolean> => {
      try {
        await deleteOrcamento(id);
        toast.success('Orçamento excluído com sucesso!');
        recarregar();
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Erro ao excluir orçamento';
        toast.error(msg);
        return false;
      }
    },
    [recarregar],
  );

  const orcamentosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return orcamentos.filter((orcamento) => {
      if (termo) {
        const matchCliente = normalizar(orcamento.cliente?.nome).includes(
          termo,
        );
        const matchNumero = normalizar(orcamento.numero_orcamento).includes(
          termo,
        );
        const matchObservacao = normalizar(orcamento.observacao).includes(
          termo,
        );
        if (!matchCliente && !matchNumero && !matchObservacao) {
          return false;
        }
      }

      if (filtroStatus !== 'todos' && orcamento.status !== filtroStatus) {
        return false;
      }

      return true;
    });
  }, [orcamentos, busca, filtroStatus]);

  const resumo = useMemo(() => {
    let enviados = 0;
    let aprovados = 0;
    let valorAprovado = 0;

    for (const orc of orcamentos) {
      if (orc.status === 'enviado') enviados += 1;
      if (orc.status === 'aprovado' || orc.status === 'convertido') {
        aprovados += 1;
        valorAprovado += Number(orc.valor_total) || 0;
      }
    }

    return {
      total: orcamentos.length,
      enviados,
      aprovados,
      valorAprovado,
    };
  }, [orcamentos]);

  const limparFiltros = useCallback(() => {
    setBusca('');
    setFiltroStatus('todos');
    setFiltroMes('todos');
    setFiltroAno('todos');
  }, []);

  return {
    orcamentos,
    orcamentosFiltrados,
    resumo,
    loading,
    erro,
    filtros: {
      busca,
      status: filtroStatus,
      mes: filtroMes,
      ano: filtroAno,
    },
    setBusca,
    setFiltroStatus,
    setFiltroMes,
    setFiltroAno,
    limparFiltros,
    recarregar,
    excluirOrcamento,
  };
}
