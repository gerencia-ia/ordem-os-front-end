'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  converterOrcamentoEmOrdem,
  deleteOrcamento,
  getOrcamentoById,
  updateOrcamentoStatus,
} from '@/src/services/orcamentos.service';
import type {
  ConverterOrcamentoPayload,
  Orcamento,
  OrcamentoStatusEditavel,
} from '@/src/types/orcamento';
import {
  baixarPdfOrcamento,
  visualizarPdfOrcamento,
} from '@/src/utils/pdf-orcamento';
import { gerarLinkWhatsAppOrcamento } from '@/src/utils/whatsapp';
import { toast } from 'sonner';

export function useOrcamentoDetalhe(orcamentoId: string | number) {
  const router = useRouter();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  const [acaoLoading, setAcaoLoading] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [convertendo, setConvertendo] = useState(false);

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setError(null);
        const dados = await getOrcamentoById(orcamentoId);
        if (ativo) {
          setOrcamento(dados);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Erro ao carregar detalhes do orçamento';
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    if (orcamentoId) {
      void carregar();
    }

    return () => {
      ativo = false;
    };
  }, [orcamentoId, versao]);

  const atualizarStatus = useCallback(
    async (novoStatus: OrcamentoStatusEditavel) => {
      if (!orcamento) return;
      try {
        setAcaoLoading(true);
        const atualizado = await updateOrcamentoStatus(
          orcamento.id,
          novoStatus,
        );
        setOrcamento(atualizado);
        toast.success('Status do orçamento atualizado!');
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Erro ao atualizar status do orçamento';
        toast.error(msg);
      } finally {
        setAcaoLoading(false);
      }
    },
    [orcamento],
  );

  const baixarPdf = useCallback(async () => {
    if (!orcamento) return;
    try {
      setGerandoPdf(true);
      await baixarPdfOrcamento(orcamento);
      toast.success('PDF do orçamento gerado!');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao gerar PDF do orçamento';
      toast.error(msg);
    } finally {
      setGerandoPdf(false);
    }
  }, [orcamento]);

  const visualizarPdf = useCallback(async () => {
    if (!orcamento) return;
    try {
      setGerandoPdf(true);
      await visualizarPdfOrcamento(orcamento);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao abrir PDF do orçamento';
      toast.error(msg);
    } finally {
      setGerandoPdf(false);
    }
  }, [orcamento]);

  const abrirWhatsApp = useCallback(() => {
    if (!orcamento) return;
    const telefone = orcamento.cliente?.telefones?.[0]?.numero;
    if (!telefone) {
      toast.error('Este cliente não possui telefone cadastrado.');
      return;
    }
    const url = gerarLinkWhatsAppOrcamento(telefone, orcamento);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [orcamento]);

  const converterEmOrdem = useCallback(
    async (payload?: ConverterOrcamentoPayload) => {
      if (!orcamento) return;
      try {
        setConvertendo(true);
        const novaOs = await converterOrcamentoEmOrdem(orcamento.id, payload);
        toast.success(
          `Orçamento convertido na OS #${novaOs.numero_ordem || novaOs.id}!`,
        );
        router.push(`/ordens/${novaOs.id}`);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Erro ao converter orçamento em Ordem de Serviço';
        toast.error(msg);
      } finally {
        setConvertendo(false);
      }
    },
    [orcamento, router],
  );

  const excluir = useCallback(async (): Promise<boolean> => {
    if (!orcamento) return false;
    try {
      setAcaoLoading(true);
      await deleteOrcamento(orcamento.id);
      toast.success('Orçamento excluído com sucesso!');
      router.push('/orcamentos');
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao excluir orçamento';
      toast.error(msg);
      return false;
    } finally {
      setAcaoLoading(false);
    }
  }, [orcamento, router]);

  return {
    orcamento,
    loading,
    error,
    acaoLoading,
    gerandoPdf,
    convertendo,
    recarregar,
    atualizarStatus,
    baixarPdf,
    visualizarPdf,
    abrirWhatsApp,
    converterEmOrdem,
    excluir,
  };
}
