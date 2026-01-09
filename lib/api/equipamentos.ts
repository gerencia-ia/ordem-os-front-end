import type { Equipamento } from "@/lib/tipos"
import { apiGet, apiPost } from "./api"

export type NovoEquipamentoPayload = {
  marca: string
  btus: string
  local_instalacao: string
  observacao?: string
  cliente_id: number
}

export type OrdemServicoResumida = {
  id: number
  numero_ordem: string
  descricao: string
  data_agendamento: string
  data_fechamento?: string
  status: string
  prioridade: string
}

export type Laudo = {
  id: number
  laudo: string
  created_at: string
  updated_at: string
  ordem_servico: OrdemServicoResumida
}

// Busca equipamentos de um cliente via query parameter
export async function getEquipamentosByCliente(clienteId: number): Promise<Equipamento[]> {
  return apiGet<Equipamento[]>(`/equipamentos?cliente_id=${clienteId}`, { cache: "no-store" })
}

// Cadastra equipamento
export async function createEquipamento(data: NovoEquipamentoPayload): Promise<Equipamento & { id: number }> {
  return apiPost<Equipamento & { id: number }>("/equipamentos", data)
}

// Busca histórico de laudos de um equipamento
export async function getHistoricoLaudosEquipamento(equipamentoId: number | string): Promise<Laudo[]> {
  return apiGet<Laudo[]>(`/equipamentos/${equipamentoId}/historico_laudos`)
}