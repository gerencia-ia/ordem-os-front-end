import { ApiError } from './api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string | null;
  cpf: string;
  telefone: string | null;
  role_id: number;
  role: {
    id: number;
    nome: string; // "Administrador" | "Secretaria" | "Tecnico"
  };
}

export interface LoginResponse {
  token: string;
  user: UsuarioLogado;
}

// Tipo de retrocompatibilidade para componentes que ainda importam TokenPayload
export type TokenPayload = UsuarioLogado;

let cachedToken: string | null = null;
let cachedUsuario: UsuarioLogado | null = null;

// Salvar dados do usuário no localStorage
export function salvarUsuario(user: UsuarioLogado): void {
  cachedUsuario = user;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('usuario', JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário no localStorage:', error);
  }
}

// Obter usuário logado diretamente do localStorage (sem jwt-decode)
export function getUsuario(): UsuarioLogado | null {
  if (typeof window === 'undefined') return null;

  const token = obterToken();
  if (!token) {
    cachedUsuario = null;
    return null;
  }

  if (cachedUsuario !== null && cachedToken === token) {
    return cachedUsuario;
  }

  try {
    const userJson = localStorage.getItem('usuario');
    if (!userJson) {
      cachedUsuario = null;
      return null;
    }
    cachedUsuario = JSON.parse(userJson) as UsuarioLogado;
    cachedToken = token;
    return cachedUsuario;
  } catch {
    cachedUsuario = null;
    return null;
  }
}

// Remover dados do usuário do localStorage
export function removerUsuario(): void {
  cachedUsuario = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem('usuario');
}

// Fazer login enviando 'password' e armazenando token e usuário
export async function loginUsuario(
  cpf: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cpf, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let msg = 'Erro ao fazer login';
    let erros: string[] = [];
    if (Array.isArray(errorData.errors)) {
      erros = errorData.errors;
      msg = errorData.errors.join(', ');
    } else if (errorData.error || errorData.message) {
      msg = errorData.error || errorData.message;
      erros = [msg];
    }
    throw new ApiError(msg, response.status, erros, errorData.details);
  }

  const data: LoginResponse = await response.json();

  salvarToken(data.token);
  if (data.user) {
    salvarUsuario(data.user);
  }

  return data;
}

// Armazenar token no localStorage
export function salvarToken(token: string): void {
  cachedToken = token;
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

// Limpeza local de credenciais
export function removerToken(): void {
  cachedToken = null;
  cachedUsuario = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.dispatchEvent(new Event('auth:logout'));
}

// Logout completo com revogação no servidor (DELETE /api/v1/logout)
export async function logoutUsuario(): Promise<void> {
  const token = obterToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Erro ao revogar sessão no servidor:', error);
    }
  }

  removerToken();
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/login';
  }
}

// Verificar se usuário está autenticado
export function estaAutenticado(): boolean {
  return obterToken() !== null;
}
