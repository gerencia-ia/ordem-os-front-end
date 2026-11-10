'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { CategoriaServico } from '@/src/types/categoria';
import {
  getCategorias,
  deleteCategoria,
} from '@/src/services/categorias.service';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  // Modais
  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [modalEditarAberta, setModalEditarAberta] = useState(false);
  const [modalExcluirAberta, setModalExcluirAberta] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaServico | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregarCategorias = useCallback(async () => {
    try {
      setErro(null);
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao carregar categorias.';
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
        const data = await getCategorias();
        if (ativo) {
          setCategorias(data);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar categorias.';
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

  const categoriasFiltradas = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return categorias;
    return categorias.filter((c) => normalizar(c.descricao).includes(termo));
  }, [categorias, busca]);

  const abrirModalCadastro = () => {
    setModalCadastroAberta(true);
  };

  const fecharModalCadastro = () => {
    setModalCadastroAberta(false);
  };

  const abrirModalEditar = (cat: CategoriaServico) => {
    setCategoriaSelecionada(cat);
    setModalEditarAberta(true);
  };

  const fecharModalEditar = () => {
    setModalEditarAberta(false);
    setCategoriaSelecionada(null);
  };

  const abrirModalExcluir = (cat: CategoriaServico) => {
    setCategoriaSelecionada(cat);
    setModalExcluirAberta(true);
  };

  const fecharModalExcluir = () => {
    setModalExcluirAberta(false);
    setCategoriaSelecionada(null);
  };

  const confirmarExcluir = async () => {
    if (!categoriaSelecionada) return;
    setExcluindo(true);
    try {
      await deleteCategoria(categoriaSelecionada.id);
      toast.success('Categoria excluída com sucesso!');
      fecharModalExcluir();
      await carregarCategorias();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao excluir categoria.';
      toast.error(msg);
    } finally {
      setExcluindo(false);
    }
  };

  return {
    categorias: categoriasFiltradas,
    totalCategorias: categorias.length,
    loading,
    erro,
    busca,
    setBusca,
    recarregar: carregarCategorias,
    // Modais
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    categoriaSelecionada,
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
