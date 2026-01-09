import { obterToken } from "./autenticacao"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

// Função para obter headers com autenticação
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  
  const token = obterToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

// Método GET
export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text().catch(() => "Erro na requisição")
    throw new Error(error)
  }
  
  return response.json()
}

// Método POST
export async function apiPost<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text().catch(() => "Erro na requisição")
    throw new Error(error)
  }
  
  return response.json()
}

// Método PUT
export async function apiPut<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text().catch(() => "Erro na requisição")
    throw new Error(error)
  }
  
  return response.json()
}

// Método PATCH
export async function apiPatch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text().catch(() => "Erro na requisição")
    throw new Error(error)
  }
  
  return response.json()
}

// Método DELETE
export async function apiDelete<T = void>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text().catch(() => "Erro na requisição")
    throw new Error(error)
  }
  
  // Se não houver conteúdo, retornar undefined
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T
  }
  
  return response.json()
}
