import { apiDelete, apiGet, apiPatch, apiPost } from './api';
import type { OrdemServico, CriarOrdemServicoPayload } from '@/src/types/ordem';

export async function getOrdens(
  mes?: number,
  ano?: number,
): Promise<OrdemServico[]> {
  let url = '/ordem_servicos';
  if (mes && ano) {
    url += `?mes=${mes}&ano=${ano}`;
  }
  return apiGet<OrdemServico[]>(url);
}

export async function getOrdemById(id: number | string): Promise<OrdemServico> {
  return apiGet<OrdemServico>(`/ordem_servicos/${id}`);
}

export async function createOrdem(
  data: CriarOrdemServicoPayload | Record<string, unknown>,
): Promise<OrdemServico> {
  return apiPost<OrdemServico>('/ordem_servicos', data);
}

export async function updateOrdemStatus(
  id: number | string,
  statusId: number,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(`/ordem_servicos/${id}/update_status`, {
    status_id: statusId,
  });
}

export async function deleteOrdem(id: number | string): Promise<void> {
  return apiDelete(`/ordem_servicos/${id}`);
}

export async function updateLaudoEquipamento(
  ordemId: number | string,
  equipamentoId: number | string,
  laudo: string,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(
    `/ordem_servicos/${ordemId}/equipamentos/${equipamentoId}/laudo`,
    { laudo },
  );
}

export async function updateHorarioAtendimento(
  ordemId: number | string,
  dataInicioAtendimento: string,
  dataFimAtendimento: string,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      data_inicio_atendimento: dataInicioAtendimento,
      data_fim_atendimento: dataFimAtendimento,
    },
  });
}

export async function addServicoOrdem(
  ordemId: number | string,
  servicoId: number | string,
  quantidade?: number,
): Promise<OrdemServico> {
  const payload: Record<string, number | string> = { servico_id: servicoId };
  if (quantidade !== undefined) payload.quantidade = quantidade;
  return apiPost<OrdemServico>(`/ordem_servicos/${ordemId}/servicos`, payload);
}

export async function removeServicoOrdem(
  ordemId: number | string,
  servicoId: number | string,
): Promise<void> {
  return apiDelete<void>(`/ordem_servicos/${ordemId}/servicos/${servicoId}`);
}

export async function addTecnicoOrdem(
  ordemId: number | string,
  tecnicoId: number | string,
): Promise<OrdemServico> {
  const idNumerico = Number(tecnicoId);
  return apiPost<OrdemServico>(`/ordem_servicos/${ordemId}/tecnicos`, {
    user_id: idNumerico,
    tecnico_id: idNumerico,
  });
}

export async function removeTecnicoOrdem(
  ordemId: number | string,
  tecnicoId: number | string,
): Promise<void> {
  return apiDelete<void>(`/ordem_servicos/${ordemId}/tecnicos/${tecnicoId}`);
}

export async function updateTecnicoResponsavel(
  ordemId: number | string,
  tecnicoId: number | string,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      tecnico_id: tecnicoId,
    },
  });
}

export async function removeTecnicoResponsavel(
  ordemId: number | string,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      tecnico_id: null,
    },
  });
}

export async function updateOrdem(
  ordemId: number | string,
  dados: Record<string, unknown>,
): Promise<OrdemServico> {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: dados,
  });
}

export async function finalizarOrdem(
  ordemId: number | string,
  dados: {
    data_inicio_atendimento?: string;
    data_fim_atendimento?: string;
    valor_total?: string | number;
    observacao?: string;
  },
): Promise<OrdemServico> {
  const agora = dados.data_fim_atendimento || new Date().toISOString();
  const payload: Record<string, unknown> = {
    data_fim_atendimento: agora,
  };
  if (dados.data_inicio_atendimento) {
    payload.data_inicio_atendimento = dados.data_inicio_atendimento;
  }
  if (dados.valor_total !== undefined) {
    payload.valor_total = dados.valor_total;
  }
  if (dados.observacao !== undefined) {
    payload.observacao = dados.observacao;
  }

  await updateOrdem(ordemId, payload);
  return updateOrdemStatus(ordemId, 3); // Status 3: Concluído
}
