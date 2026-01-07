import type { Cliente } from "@/lib/tipos"
import { apiGet, apiPost, apiPut, apiDelete } from "./api"

export type NovoClientePayload = {
  nome: string
  email?: string | null
  telefones_attributes: { numero: string }[]
  enderecos_attributes: { rua: string; numero: string; bairro: string; complemento?: string; cidade: string }[]
  equipamentos_attributes?: Array<{
    marca?: string
    btus?: string
    local_instalacao?: string
    observacao?: string
  }>
}

export type AtualizarClientePayload = {
  nome?: string
  email?: string | null
  telefones_attributes?: Array<{ id?: number; numero?: string; _destroy?: boolean }>
  enderecos_attributes?: Array<{
    id?: number
    rua?: string
    numero?: string
    bairro?: string
    complemento?: string
    cidade?: string
    _destroy?: boolean
  }>
  equipamentos_attributes?: Array<{
    id?: number
    marca?: string
    btus?: string
    local_instalacao?: string
    observacao?: string
    _destroy?: boolean
  }>
}

export async function getClientes(): Promise<Cliente[]> {
  return apiGet<Cliente[]>("/clientes", { cache: "no-store" })
}

export async function getClienteById(id: string): Promise<Cliente> {
  return apiGet<Cliente>(`/clientes/${id}`)
}

export async function createCliente(data: NovoClientePayload): Promise<Cliente> {
  return apiPost<Cliente>("/clientes", data)
}

export async function updateCliente(id: string, data: AtualizarClientePayload): Promise<Cliente> {
  return apiPut<Cliente>(`/clientes/${id}`, data)
}

export async function deleteCliente(id: string): Promise<void> {
  return apiDelete(`/clientes/${id}`)
}