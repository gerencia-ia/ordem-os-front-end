import { obterToken, removerToken } from '@/src/lib/api/autenticacao';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  const token = obterToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      removerToken();
      window.dispatchEvent(new Event('auth:logout'));
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    let mensagemErro = 'Erro na requisição';
    try {
      const data = await response.json();
      mensagemErro = data.message || data.error || mensagemErro;
    } catch {
      const text = await response.text().catch(() => '');
      if (text) mensagemErro = text;
    }
    throw new Error(mensagemErro);
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined as T;
  }

  return response.json();
}

export async function apiGet<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(options?.headers),
    ...options,
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(options?.headers),
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...options,
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(options?.headers),
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...options,
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(options?.headers),
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...options,
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T = void>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(options?.headers),
    ...options,
  });
  return handleResponse<T>(response);
}
