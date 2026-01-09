import type { Servico } from "@/lib/tipos"
import { apiGet, apiPost, apiPut, apiDelete } from "./api"

export type NovoServicoPayload = {
  nome: string
  valor: number
}

export async function getServicos(): Promise<Servico[]> {
  return apiGet<Servico[]>("/servicos", { cache: "no-store" })
}

export async function getServicoById(id: string): Promise<Servico> {
  return apiGet<Servico>(`/servicos/${id}`)
}

export async function createServico(data: NovoServicoPayload): Promise<Servico> {
  return apiPost<Servico>("/servicos", data)
}

export async function updateServico(id: string, data: Partial<NovoServicoPayload>): Promise<Servico> {
  return apiPut<Servico>(`/servicos/${id}`, data)
}

export async function deleteServico(id: string): Promise<void> {
  return apiDelete(`/servicos/${id}`)
}