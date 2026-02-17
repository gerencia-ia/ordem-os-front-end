import { OrdemServico } from "@/lib/tipos"
import { apiDelete, apiGet, apiPatch, apiPost } from "./api"

// Buscar detalhes de uma ordem de serviço por ID
export async function getOrdemServicoById(id: number | string) {
  return apiGet<OrdemServico>(`/ordem_servicos/${id}`)
}

// Buscar todas as ordens de serviço
export async function getOrdensServico(mes?: number, ano?: number): Promise<OrdemServico[]> {
  let url = "/ordem_servicos"
  
  if (mes && ano) {
    url += `?mes=${mes}&ano=${ano}`
  }
  
  return apiGet<OrdemServico[]>(url)
}

export async function createOrdemServico(ordem: any): Promise<OrdemServico> {
  return apiPost<OrdemServico>("/ordem_servicos", ordem)
}

// Atualizar o status de uma ordem de serviço
export async function updateOrdemServicoStatus(id: number | string, status_id: number) {
  return apiPatch<OrdemServico>(`/ordem_servicos/${id}/update_status`, { status_id })
}

// Atualizar laudo de um equipamento vinculado à OS
export async function updateLaudoEquipamento(
  ordemId: number | string,
  equipamentoId: number | string,
  laudo: string,
) {
  return apiPatch<OrdemServico>(
    `/ordem_servicos/${ordemId}/equipamentos/${equipamentoId}/laudo`,
    { laudo },
  )
}

// Atualizar horários de atendimento da OS
export async function updateHorarioAtendimento(
  ordemId: number | string,
  dataInicioAtendimento: string,
  dataFimAtendimento: string,
) {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      data_inicio_atendimento: dataInicioAtendimento,
      data_fim_atendimento: dataFimAtendimento,
    },
  })
}

// Adicionar serviço à ordem (quantidade opcional)
export async function addServicoOrdem(
  ordemId: number | string,
  servicoId: number | string,
  quantidade?: number,
) {
  const payload: Record<string, number | string> = { servico_id: servicoId }
  if (quantidade !== undefined) payload.quantidade = quantidade
  return apiPost<OrdemServico>(`/ordem_servicos/${ordemId}/servicos`, payload)
}

// Remover serviço da ordem
export async function removeServicoOrdem(ordemId: number | string, servicoId: number | string) {
  return apiDelete<void>(`/ordem_servicos/${ordemId}/servicos/${servicoId}`)
}

// Adicionar/atribuir técnico à ordem
export async function addTecnicoOrdem(ordemId: number | string, tecnicoId: number | string) {
  return apiPost<OrdemServico>(`/ordem_servicos/${ordemId}/tecnicos`, {
    tecnico_id: tecnicoId,
  })
}

// Remover técnico específico da ordem
export async function removeTecnicoOrdem(ordemId: number | string, tecnicoId: number | string) {
  return apiDelete<void>(`/ordem_servicos/${ordemId}/tecnicos/${tecnicoId}`)
}

// Definir técnico responsável da ordem
export async function updateTecnicoResponsavel(ordemId: number | string, tecnicoId: number | string) {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      tecnico_id: tecnicoId,
    },
  })
}

// Remover técnico responsável da ordem
export async function removeTecnicoResponsavel(ordemId: number | string) {
  return apiPatch<OrdemServico>(`/ordem_servicos/${ordemId}`, {
    ordem_servico: {
      tecnico_id: null,
    },
  })
}

