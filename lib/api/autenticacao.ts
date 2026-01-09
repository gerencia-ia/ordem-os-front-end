const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type LoginResponse = {
  token: string
  role: "SECRETARIA" | "TECNICO" | string
}

// Fazer login com CPF e senha
export async function loginUsuario(cpf: string, senha: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cpf, senha }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Erro ao fazer login")
  }

  return response.json()
}

// Armazenar token no localStorage
export function salvarToken(token: string, role: string): void {
  localStorage.setItem("token", token)

  localStorage.setItem("role", role == 0 ? "SECRETARIA" : "TECNICO")
}

// Recuperar token do localStorage
export function obterToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

// Obter headers com autenticação
export function obterHeadersAutenticados(): HeadersInit {
  const token = obterToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

// Remover token (logout)
export function removerToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}

// Verificar se usuário está autenticado
export function estaAutenticado(): boolean {
  return obterToken() !== null
}

// Fazer logout
export async function logout(): Promise<void> {
  removerToken()
}
