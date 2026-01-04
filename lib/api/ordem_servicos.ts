import { OrdemServico } from "@/lib/tipos"
import { apiGet, apiPost, apiPatch } from "./api"

// Buscar detalhes de uma ordem de serviço por ID
export async function getOrdemServicoById(id: number | string) {
  return apiGet<OrdemServico>(`/ordem_servicos/${id}`)
}

// Buscar todas as ordens de serviço
export async function getOrdensServico(): Promise<OrdemServico[]> {
  return apiGet<OrdemServico[]>("/ordem_servicos")
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

