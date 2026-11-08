'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { OrdemServico, Status } from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';
import type { Usuario } from '@/src/types/usuario';
import type { Equipamento, HistoricoLaudo } from '@/src/types/equipamento';
import {
  getOrdemById,
  updateOrdemStatus,
  updateLaudoEquipamento,
  updateHorarioAtendimento,
  finalizarOrdem,
  addServicoOrdem,
  removeServicoOrdem,
  addTecnicoOrdem,
  removeTecnicoOrdem,
} from '@/src/services/ordens.service';
import { getHistoricoLaudos } from '@/src/services/equipamentos.service';
import { getServicos } from '@/src/services/servicos.service';
import { getUsuarios } from '@/src/services/usuarios.service';
import { getStatus } from '@/src/services/status.service';
import { normalizarPerfil } from '@/src/lib/permissions';

const STATUS_FALLBACK: Status[] = [
  { id: 1, nome: 'Agendado' },
  { id: 2, nome: 'Em Progresso' },
  { id: 3, nome: 'Concluído' },
  { id: 4, nome: 'Cancelado' },
  { id: 5, nome: 'Não Iniciada' },
  { id: 6, nome: 'Em Andamento' },
  { id: 7, nome: 'Bloqueada' },
];

export function useOrdemDetalhe(ordemId: string | number) {
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acaoLoading, setAcaoLoading] = useState(false);

  // Auxiliares
  const [statusList, setStatusList] = useState<Status[]>(STATUS_FALLBACK);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  const [servicosLoading, setServicosLoading] = useState(false);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<Usuario[]>([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);

  // Modal Laudo
  const [modalLaudoAberta, setModalLaudoAberta] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] =
    useState<Equipamento | null>(null);
  const [textoLaudo, setTextoLaudo] = useState('');
  const [laudoSaving, setLaudoSaving] = useState(false);

  // Modal Histórico de Laudos
  const [modalHistoricoAberta, setModalHistoricoAberta] = useState(false);
  const [laudosHistorico, setLaudosHistorico] = useState<HistoricoLaudo[]>([]);
  const [historicoLoading, setHistoricoLoading] = useState(false);

  // Modal Adicionar Serviço
  const [modalServicoAberta, setModalServicoAberta] = useState(false);
  const [servicoIdInput, setServicoIdInput] = useState('');
  const [quantidadeInput, setQuantidadeInput] = useState('');
  const [servicoSaving, setServicoSaving] = useState(false);
  const [remocaoServicoId, setRemocaoServicoId] = useState<
    number | string | null
  >(null);

  // Modal Técnico
  const [modalTecnicoAberta, setModalTecnicoAberta] = useState(false);
  const [tecnicoIdInput, setTecnicoIdInput] = useState('');
  const [tecnicoAtualSubstituir, setTecnicoAtualSubstituir] =
    useState<Usuario | null>(null);
  const [tecnicoSaving, setTecnicoSaving] = useState(false);

  // Modal Finalizar Atendimento
  const [modalFinalizarAberta, setModalFinalizarAberta] = useState(false);
  const [valorFinal, setValorFinal] = useState('');
  const [observacaoFinal, setObservacaoFinal] = useState('');
  const [finalizandoSalvo, setFinalizandoSalvo] = useState(false);

  // Carregar dados principais da ordem após ações do usuário
  const carregarOrdem = useCallback(async () => {
    if (!ordemId) return;
    try {
      const data = await getOrdemById(ordemId);
      setOrdem(data);
      setError(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao buscar ordem de serviço';
      setError(msg);
      toast.error(msg);
    }
  }, [ordemId]);

  // Efeito de inicialização com cancelamento seguro
  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      if (!ordemId) return;
      try {
        const [ordemData, statusData] = await Promise.allSettled([
          getOrdemById(ordemId),
          getStatus(),
        ]);

        if (!ativo) return;

        if (ordemData.status === 'fulfilled') {
          setOrdem(ordemData.value);
        } else {
          const msg =
            ordemData.reason instanceof Error
              ? ordemData.reason.message
              : 'Erro ao buscar ordem de serviço';
          setError(msg);
          toast.error(msg);
        }

        if (statusData.status === 'fulfilled' && statusData.value?.length > 0) {
          setStatusList(statusData.value);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Erro ao buscar ordem de serviço';
          setError(msg);
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
  }, [ordemId]);

  // Carregar serviços sob demanda
  const carregarServicos = useCallback(async () => {
    if (servicosDisponiveis.length > 0) return;
    setServicosLoading(true);
    try {
      const lista = await getServicos();
      setServicosDisponiveis(lista);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
      toast.error('Não foi possível carregar o catálogo de serviços.');
    } finally {
      setServicosLoading(false);
    }
  }, [servicosDisponiveis.length]);

  // Carregar técnicos sob demanda (filtrando estritamente usuários com perfil de técnico)
  const carregarUsuarios = useCallback(async () => {
    if (usuariosDisponiveis.length > 0) return;
    setUsuariosLoading(true);
    try {
      const lista = await getUsuarios();
      const apenasTecnicos = lista.filter((u) => {
        const perfilNorm = normalizarPerfil(u.role?.nome);
        return perfilNorm === 'tecnico' || u.role_id === 2;
      });
      setUsuariosDisponiveis(apenasTecnicos);
    } catch (err) {
      console.error('Erro ao carregar técnicos:', err);
      toast.error('Não foi possível carregar a lista de técnicos.');
    } finally {
      setUsuariosLoading(false);
    }
  }, [usuariosDisponiveis.length]);

  // Atualizar Status
  const atualizarStatus = async (novoStatusId: number) => {
    if (!ordem) return;
    setAcaoLoading(true);
    try {
      await updateOrdemStatus(ordem.id, novoStatusId);
      toast.success('Status da ordem atualizado com sucesso!');
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao atualizar status.';
      toast.error(msg);
    } finally {
      setAcaoLoading(false);
    }
  };

  // Iniciar Atendimento
  const iniciarAtendimento = async () => {
    if (!ordem) return;
    setAcaoLoading(true);
    try {
      const agora = new Date().toISOString();
      await updateHorarioAtendimento(ordem.id, agora, '');
      await updateOrdemStatus(ordem.id, 2); // Status 2: Em Progresso
      toast.success('Atendimento iniciado com sucesso!');
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao iniciar atendimento.';
      toast.error(msg);
    } finally {
      setAcaoLoading(false);
    }
  };

  // Finalizar Atendimento - Abertura e Envio
  const abrirModalFinalizar = () => {
    if (!ordem) return;
    setValorFinal(ordem.valor_total || '');
    setObservacaoFinal(ordem.observacao || '');
    setModalFinalizarAberta(true);
  };

  const fecharModalFinalizar = () => {
    setModalFinalizarAberta(false);
  };

  const salvarFinalizacao = async () => {
    if (!ordem) return;
    setFinalizandoSalvo(true);
    try {
      const dataInicio =
        ordem.data_inicio_atendimento || new Date().toISOString();
      await finalizarOrdem(ordem.id, {
        data_inicio_atendimento: dataInicio,
        valor_total: valorFinal.trim() ? valorFinal : undefined,
        observacao: observacaoFinal.trim() ? observacaoFinal : undefined,
      });

      toast.success('Atendimento finalizado com sucesso!');
      setModalFinalizarAberta(false);
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao finalizar atendimento.';
      toast.error(msg);
    } finally {
      setFinalizandoSalvo(false);
    }
  };

  // Laudos
  const abrirModalLaudo = (equip: Equipamento) => {
    setEquipamentoSelecionado(equip);
    setTextoLaudo(equip.laudo || '');
    setModalLaudoAberta(true);
  };

  const fecharModalLaudo = () => {
    setModalLaudoAberta(false);
    setEquipamentoSelecionado(null);
    setTextoLaudo('');
  };

  const salvarLaudo = async () => {
    if (!ordem || !equipamentoSelecionado || !textoLaudo.trim()) return;
    setLaudoSaving(true);
    try {
      await updateLaudoEquipamento(
        ordem.id,
        equipamentoSelecionado.id,
        textoLaudo.trim(),
      );
      toast.success('Laudo técnico salvo com sucesso!');
      fecharModalLaudo();
      await carregarOrdem();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar laudo.';
      toast.error(msg);
    } finally {
      setLaudoSaving(false);
    }
  };

  // Histórico de Laudos
  const abrirModalHistorico = async (equip: Equipamento) => {
    setEquipamentoSelecionado(equip);
    setHistoricoLoading(true);
    setModalHistoricoAberta(true);
    try {
      const laudos = await getHistoricoLaudos(equip.id);
      setLaudosHistorico(laudos);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      toast.error('Erro ao carregar histórico de laudos.');
      setLaudosHistorico([]);
    } finally {
      setHistoricoLoading(false);
    }
  };

  const fecharModalHistorico = () => {
    setModalHistoricoAberta(false);
    setEquipamentoSelecionado(null);
    setLaudosHistorico([]);
  };

  // Serviços
  const abrirModalAdicionarServico = () => {
    setServicoIdInput('');
    setQuantidadeInput('');
    void carregarServicos();
    setModalServicoAberta(true);
  };

  const fecharModalAdicionarServico = () => {
    setModalServicoAberta(false);
    setServicoIdInput('');
    setQuantidadeInput('');
  };

  const salvarServico = async () => {
    if (!ordem || !servicoIdInput.trim()) return;
    setServicoSaving(true);
    try {
      const qtd = quantidadeInput === '' ? undefined : Number(quantidadeInput);
      await addServicoOrdem(ordem.id, servicoIdInput.trim(), qtd);
      toast.success('Serviço adicionado com sucesso!');
      fecharModalAdicionarServico();
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao adicionar serviço.';
      toast.error(msg);
    } finally {
      setServicoSaving(false);
    }
  };

  const removerServico = async (servicoId: number | string) => {
    if (!ordem) return;
    setRemocaoServicoId(servicoId);
    try {
      await removeServicoOrdem(ordem.id, servicoId);
      toast.success('Serviço removido com sucesso!');
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao remover serviço.';
      toast.error(msg);
    } finally {
      setRemocaoServicoId(null);
    }
  };

  // Técnicos
  const abrirModalTecnico = (tecnicoAtual?: Usuario | null) => {
    setTecnicoAtualSubstituir(tecnicoAtual || null);
    setTecnicoIdInput(tecnicoAtual?.id ? String(tecnicoAtual.id) : '');
    void carregarUsuarios();
    setModalTecnicoAberta(true);
  };

  const fecharModalTecnico = () => {
    setModalTecnicoAberta(false);
    setTecnicoIdInput('');
    setTecnicoAtualSubstituir(null);
  };

  const salvarTecnico = async () => {
    if (!ordem || !tecnicoIdInput.trim()) return;
    setTecnicoSaving(true);
    try {
      const novoId = tecnicoIdInput.trim();
      // Se estiver substituindo um técnico existente por um diferente
      if (
        tecnicoAtualSubstituir?.id &&
        String(tecnicoAtualSubstituir.id) !== novoId
      ) {
        await removeTecnicoOrdem(ordem.id, tecnicoAtualSubstituir.id);
      }
      await addTecnicoOrdem(ordem.id, novoId);
      toast.success('Técnico atribuído com sucesso!');
      fecharModalTecnico();
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao atribuir técnico.';
      toast.error(msg);
    } finally {
      setTecnicoSaving(false);
    }
  };

  const removerTecnico = async (tecnicoId?: string | number) => {
    if (!ordem) return;
    const targetId =
      tecnicoId ??
      (Array.isArray(ordem.tecnicos)
        ? ordem.tecnicos[0]?.id
        : (ordem.tecnicos as Usuario | null)?.id) ??
      ordem.tecnico_responsavel?.id;
    if (!targetId) return;
    setTecnicoSaving(true);
    try {
      await removeTecnicoOrdem(ordem.id, targetId);
      toast.success('Técnico desvinculado com sucesso!');
      await carregarOrdem();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao desvincular técnico.';
      toast.error(msg);
    } finally {
      setTecnicoSaving(false);
    }
  };

  // Contato WhatsApp
  const contatarClienteWhatsApp = () => {
    if (!ordem?.cliente) return;
    const numeroOriginal = ordem.cliente.telefones?.find(() => true)?.numero;
    if (!numeroOriginal) {
      toast.error('Cliente não possui telefone cadastrado.');
      return;
    }
    const digits = String(numeroOriginal).replace(/\D/g, '');
    if (!digits) {
      toast.error('Telefone do cliente é inválido.');
      return;
    }
    let phone = digits;
    if (!phone.startsWith('55') && phone.length <= 11) {
      phone = `55${phone}`;
    }
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return {
    ordem,
    loading,
    error,
    acaoLoading,
    recarregar: carregarOrdem,
    statusList,
    atualizarStatus,
    iniciarAtendimento,
    // Finalização
    modalFinalizarAberta,
    valorFinal,
    setValorFinal,
    observacaoFinal,
    setObservacaoFinal,
    finalizandoSalvo,
    abrirModalFinalizar,
    fecharModalFinalizar,
    salvarFinalizacao,
    // Laudos
    modalLaudoAberta,
    equipamentoSelecionado,
    textoLaudo,
    setTextoLaudo,
    laudoSaving,
    abrirModalLaudo,
    fecharModalLaudo,
    salvarLaudo,
    // Histórico de Laudos
    modalHistoricoAberta,
    laudosHistorico,
    historicoLoading,
    abrirModalHistorico,
    fecharModalHistorico,
    // Serviços
    servicosDisponiveis,
    servicosLoading,
    modalServicoAberta,
    servicoIdInput,
    setServicoIdInput,
    quantidadeInput,
    setQuantidadeInput,
    servicoSaving,
    remocaoServicoId,
    abrirModalAdicionarServico,
    fecharModalAdicionarServico,
    salvarServico,
    removerServico,
    // Técnicos
    usuariosDisponiveis,
    usuariosLoading,
    modalTecnicoAberta,
    tecnicoIdInput,
    setTecnicoIdInput,
    tecnicoSaving,
    abrirModalTecnico,
    fecharModalTecnico,
    salvarTecnico,
    removerTecnico,
    // Contato
    contatarClienteWhatsApp,
  };
}
