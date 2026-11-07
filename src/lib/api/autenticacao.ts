const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
import { jwtDecode } from 'jwt-decode';

export type LoginResponse = {
  token: string;
};

export type TokenPayload = {
  user_id: number;
  nome: string;
  cpf: string;
  role: string;
};

let cachedToken: string | null = null;
let cachedUsuario: TokenPayload | null = null;

export function getUsuario(): TokenPayload | null {
  const token = obterToken();
  if (!token) {
    cachedToken = null;
    cachedUsuario = null;
    return null;
  }

  if (token === cachedToken && cachedUsuario !== null) {
    return cachedUsuario;
  }

  try {
    cachedToken = token;
    cachedUsuario = jwtDecode<TokenPayload>(token);
    return cachedUsuario;
  } catch {
    cachedToken = null;
    cachedUsuario = null;
    return null;
  }
}

// Fazer login com CPF e senha
export async function loginUsuario(
  cpf: string,
  senha: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cpf, senha }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro ao fazer login');
  }

  return response.json();
}

// Armazenar token no localStorage
export function salvarToken(token: string): void {
  cachedToken = null;
  cachedUsuario = null;
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event('auth:login'));
}

// Recuperar token do localStorage
export function obterToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Obter headers com autenticação
export function obterHeadersAutenticados(): HeadersInit {
  const token = obterToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Remover token (logout)
export function removerToken(): void {
  cachedToken = null;
  cachedUsuario = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('auth:logout'));
}

// Verificar se usuário está autenticado
export function estaAutenticado(): boolean {
  return obterToken() !== null;
}

// Fazer logout
export async function logout(): Promise<void> {
  removerToken();
}
