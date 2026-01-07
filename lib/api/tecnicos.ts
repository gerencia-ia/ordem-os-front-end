import type { Tecnico } from "@/lib/tipos"
import { apiGet, apiPost, apiPut, apiDelete } from "./api"

export type NovoTecnicoPayload = {
  nome: string
  cpf: string
  telefone: string
  especialidades: string[]
}

export async function getTecnicos(): Promise<Tecnico[]> {
  return apiGet<Tecnico[]>("/tecnicos", { cache: "no-store" })
}

export async function getTecnicoById(id: string): Promise<Tecnico> {
  return apiGet<Tecnico>(`/tecnicos/${id}`)
}

export async function createTecnico(data: NovoTecnicoPayload): Promise<Tecnico> {
  return apiPost<Tecnico>("/tecnicos", data)
}

export async function updateTecnico(id: string, data: Partial<NovoTecnicoPayload>): Promise<Tecnico> {
  return apiPut<Tecnico>(`/tecnicos/${id}`, data)
}

export async function deleteTecnico(id: string): Promise<void> {
  return apiDelete(`/tecnicos/${id}`)
}