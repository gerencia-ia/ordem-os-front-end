import { obterToken, removerToken } from './auth.service';

import { API_BASE_URL } from '@/src/lib/config';

export class ApiError extends Error {
  status: number;
  errors: string[];
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    errors: string[] = [],
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.details = details;
  }
}

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

let isRedirectingToLogin = false;

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== 'undefined' && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      removerToken();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
    throw new ApiError('Sessão expirada. Faça login novamente.', 401, [
      'Sessão expirada. Faça login novamente.',
    ]);
  }

  if (!response.ok) {
    let mensagemErro = 'Erro na requisição';
    let errosArray: string[] = [];
    let details: Record<string, unknown> | undefined;

    try {
      const data = await response.json();
      details = data.details;

      if (Array.isArray(data.errors)) {
        errosArray = data.errors;
        mensagemErro = data.errors.join(', ');
      } else if (data.errors && typeof data.errors === 'object') {
        const valores = Object.values(data.errors).flat() as string[];
        errosArray = valores;
        mensagemErro = valores.join(', ');
      } else if (data.message || data.error) {
        const msg = data.message || data.error;
        errosArray = [msg];
        mensagemErro = msg;
      }
    } catch {
      const text = await response.text().catch(() => '');
      if (text) {
        mensagemErro = text;
        errosArray = [text];
      }
    }

    throw new ApiError(mensagemErro, response.status, errosArray, details);
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
