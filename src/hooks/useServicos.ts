'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Servico } from '@/src/types/servico';
import type { CategoriaServico } from '@/src/types/categoria';
import { getServicos, deleteServico } from '@/src/services/servicos.service';
import { getCategorias } from '@/src/services/categorias.service';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  // Modais
  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [modalEditarAberta, setModalEditarAberta] = useState(false);
  const [modalExcluirAberta, setModalExcluirAberta] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      setErro(null);
      const [servicosData, categoriasData] = await Promise.all([
        getServicos(),
        getCategorias(),
      ]);
      setServicos(servicosData);
      setCategorias(categoriasData);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Erro ao carregar catálogo de serviços.';
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        const [servicosRes, categoriasRes] = await Promise.allSettled([
          getServicos(),
          getCategorias(),
        ]);

        if (!ativo) return;

        if (servicosRes.status === 'fulfilled') {
          setServicos(servicosRes.value);
        } else {
          const msg =
            servicosRes.reason instanceof Error
              ? servicosRes.reason.message
              : 'Erro ao carregar serviços.';
          setErro(msg);
          toast.error(msg);
        }

        if (categoriasRes.status === 'fulfilled') {
          setCategorias(categoriasRes.value);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar dados.';
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
  }, []);

  const servicosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return servicos.filter((s) => {
      // Filtro textual
      if (termo && !normalizar(s.nome).includes(termo)) {
        return false;
      }

      // Filtro por categoria
      if (filtroCategoria !== 'todas') {
        const catId =
          s.categorias_servico_id ||
          s.categorias_servico?.id ||
          s.categoria?.id;
        if (String(catId) !== filtroCategoria) {
          return false;
        }
      }

      return true;
    });
  }, [servicos, busca, filtroCategoria]);

  const abrirModalCadastro = () => {
    setModalCadastroAberta(true);
  };

  const fecharModalCadastro = () => {
    setModalCadastroAberta(false);
  };

  const abrirModalEditar = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalEditarAberta(true);
  };

  const fecharModalEditar = () => {
    setModalEditarAberta(false);
    setServicoSelecionado(null);
  };

  const abrirModalExcluir = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalExcluirAberta(true);
  };

  const fecharModalExcluir = () => {
    setModalExcluirAberta(false);
    setServicoSelecionado(null);
  };

  const confirmarExcluir = async () => {
    if (!servicoSelecionado) return;
    setExcluindo(true);
    try {
      await deleteServico(servicoSelecionado.id);
      toast.success('Serviço excluído com sucesso!');
      fecharModalExcluir();
      await carregarDados();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao excluir serviço.';
      toast.error(msg);
    } finally {
      setExcluindo(false);
    }
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroCategoria('todas');
  };

  return {
    servicos: servicosFiltrados,
    totalServicos: servicos.length,
    categorias,
    loading,
    erro,
    busca,
    setBusca,
    filtroCategoria,
    setFiltroCategoria,
    limparFiltros,
    recarregar: carregarDados,
    // Modais
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    servicoSelecionado,
    excluindo,
    abrirModalCadastro,
    fecharModalCadastro,
    abrirModalEditar,
    fecharModalEditar,
    abrirModalExcluir,
    fecharModalExcluir,
    confirmarExcluir,
  };
}
