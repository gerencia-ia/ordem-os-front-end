import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type {
  Cliente,
  NovoClientePayload,
  AtualizarClientePayload,
} from '@/src/types/cliente';

export async function getClientes(): Promise<Cliente[]> {
  return apiGet<Cliente[]>('/clientes', { cache: 'no-store' });
}

export async function getClienteById(id: number | string): Promise<Cliente> {
  return apiGet<Cliente>(`/clientes/${id}`);
}

export async function createCliente(
  payload: NovoClientePayload,
): Promise<Cliente> {
  return apiPost<Cliente>('/clientes', payload);
}

export async function updateCliente(
  id: number | string,
  payload: AtualizarClientePayload,
): Promise<Cliente> {
  return apiPut<Cliente>(`/clientes/${id}`, payload);
}

export async function deleteCliente(id: number | string): Promise<void> {
  return apiDelete(`/clientes/${id}`);
}
