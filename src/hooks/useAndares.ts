'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Andar } from '@/src/types/andar';
import { getAndares, deleteAndar } from '@/src/services/andares.service';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useAndares() {
  const [andares, setAndares] = useState<Andar[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  // Modais
  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [modalEditarAberta, setModalEditarAberta] = useState(false);
  const [modalExcluirAberta, setModalExcluirAberta] = useState(false);
  const [andarSelecionado, setAndarSelecionado] = useState<Andar | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregarAndares = useCallback(async () => {
    try {
      setErro(null);
      const data = await getAndares();
      setAndares(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao carregar andares.';
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
        const data = await getAndares();
        if (ativo) {
          setAndares(data);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar andares.';
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

  const andaresFiltrados = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return andares;
    return andares.filter((a) => normalizar(a.descricao).includes(termo));
  }, [andares, busca]);

  const abrirModalCadastro = () => {
    setModalCadastroAberta(true);
  };

  const fecharModalCadastro = () => {
    setModalCadastroAberta(false);
  };

  const abrirModalEditar = (andar: Andar) => {
    setAndarSelecionado(andar);
    setModalEditarAberta(true);
  };

  const fecharModalEditar = () => {
    setModalEditarAberta(false);
    setAndarSelecionado(null);
  };

  const abrirModalExcluir = (andar: Andar) => {
    setAndarSelecionado(andar);
    setModalExcluirAberta(true);
  };

  const fecharModalExcluir = () => {
    setModalExcluirAberta(false);
    setAndarSelecionado(null);
  };

  const confirmarExcluir = async () => {
    if (!andarSelecionado) return;
    setExcluindo(true);
    try {
      await deleteAndar(andarSelecionado.id);
      toast.success('Andar excluído com sucesso!');
      fecharModalExcluir();
      await carregarAndares();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir andar.';
      toast.error(msg);
    } finally {
      setExcluindo(false);
    }
  };

  return {
    andares: andaresFiltrados,
    totalAndares: andares.length,
    loading,
    erro,
    busca,
    setBusca,
    recarregar: carregarAndares,
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    andarSelecionado,
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
