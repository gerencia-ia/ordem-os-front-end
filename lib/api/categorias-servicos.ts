import type { CategoriaServico } from "@/lib/tipos"
import { apiGet, apiPost, apiPut, apiDelete } from "./api"

export type NovaCategoriaPayload = {
  descricao: string
}

export async function getCategorias(): Promise<CategoriaServico[]> {
  return apiGet<CategoriaServico[]>("/categorias_servico", { cache: "no-store" })
}

export async function getCategoriaById(id: string): Promise<CategoriaServico> {
  return apiGet<CategoriaServico>(`/categorias_servico/${id}`)
}

export async function createCategoria(data: NovaCategoriaPayload): Promise<CategoriaServico> {
  return apiPost<CategoriaServico>("/categorias_servico", data)
}

export async function updateCategoria(id: string, data: Partial<NovaCategoriaPayload>): Promise<CategoriaServico> {
  return apiPut<CategoriaServico>(`/categorias_servico/${id}`, data)
}

export async function deleteCategoria(id: string): Promise<void> {
  return apiDelete(`/categorias_servico/${id}`)
}
