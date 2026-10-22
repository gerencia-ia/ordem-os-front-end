import type { User } from "@/lib/tipos"
import { apiDelete, apiGet, apiPatch, apiPost } from "./api"

export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>("/users")
}

export async function getUserById(id: string | number): Promise<User> {
  return apiGet<User>(`/users/${id}`)
}

export async function createUser(data: {
  nome: string
  cpf: string
  email: string
  telefone: string
  senha: string
  role_id: number
}): Promise<User> {
  return apiPost<User>("/users", data)
}

export async function updateUser(
  id: string | number,
  data: {
    nome?: string
    cpf?: string
    email?: string
    telefone?: string
    senha?: string
    role_id?: number
  },
): Promise<User> {
  return apiPatch<User>(`/users/${id}`, data)
}

export async function deleteUser(id: string | number): Promise<void> {
  return apiDelete(`/users/${id}`)
}